import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './AdminPage.module.css';

// Komponen Modal untuk form Tambah/Edit dengan FUNGSI UPLOAD
const CandidateModal = ({ candidate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    konsulat: '',
    visi: '',
    misi: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        konsulat: candidate.konsulat || '',
        visi: candidate.visi || '',
        misi: candidate.misi || '',
      });
      setImagePreview(candidate.image || null);
    } else {
      // Reset form untuk kandidat baru
      setFormData({ name: '', konsulat: '', visi: '', misi: '' });
      setImagePreview(null);
    }
  }, [candidate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert('Silakan pilih file gambar dengan format PNG atau JPG.');
      setSelectedFile(null);
      e.target.value = null; // Reset input file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Kirim form data dan file yang dipilih ke parent component
      await onSave(formData, selectedFile);
      onClose();
    } catch (error) {
      console.error('Failed to save candidate:', error);
      alert(`Gagal menyimpan: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{candidate ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nama Kandidat</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="image">Foto Kandidat</label>
            <input type="file" id="image" name="image" accept="image/png, image/jpeg" onChange={handleFileChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="konsulat">Konsulat/Wilayah</label>
            <input type="text" id="konsulat" name="konsulat" value={formData.konsulat} onChange={(e) => setFormData({...formData, konsulat: e.target.value})} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="visi">Visi</label>
            <textarea id="visi" name="visi" value={formData.visi} onChange={(e) => setFormData({...formData, visi: e.target.value})} rows="3"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="misi">Misi</label>
            <textarea id="misi" name="misi" value={formData.misi} onChange={(e) => setFormData({...formData, misi: e.target.value})} rows="5"></textarea>
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} disabled={isSaving} className={styles.cancelButton}>Batal</button>
            <button type="submit" disabled={isSaving} className={styles.saveButton}>
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Komponen Utama Halaman Admin
function AdminPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setCandidates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
    const subscription = supabase
      .channel('candidates-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, () => {
        fetchCandidates();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchCandidates]);

  // FUNGSI CRUD DENGAN LOGIKA UPLOAD
  const handleSaveCandidate = async (formData, selectedFile) => {
    let imageUrl = editingCandidate?.image || null; // Simpan URL gambar lama (untuk mode edit)

    // Langkah 1: Jika ada file baru yang dipilih, upload ke Supabase Storage
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kandidat-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Langkah 2: Dapatkan Public URL dari file yang baru di-upload
      const { data: urlData } = supabase.storage
        .from('kandidat-images')
        .getPublicUrl(filePath);
      
      imageUrl = urlData.publicUrl;
    }

    // Langkah 3: Siapkan data final untuk disimpan ke database
    const finalCandidateData = {
      ...formData,
      image: imageUrl,
    };

    // Langkah 4: Simpan data ke tabel 'candidates'
    if (editingCandidate) {
      // Mode Update
      const { error: updateError } = await supabase
        .from('candidates')
        .update(finalCandidateData)
        .eq('id', editingCandidate.id);
      if (updateError) throw updateError;
    } else {
      // Mode Create
      const { error: insertError } = await supabase.from('candidates').insert([finalCandidateData]);
      if (insertError) throw insertError;
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
      const { error } = await supabase.from('candidates').delete().eq('id', candidateId);
      if (error) alert(`Gagal menghapus: ${error.message}`);
    }
  };

  const handleResetVotes = async () => {
    if (window.confirm('PERINGATAN: Aksi ini akan mengatur ulang (reset) semua suara menjadi 0. Apakah Anda yakin?')) {
      const { error } = await supabase.from('candidates').update({ votes: 0 }).neq('votes', 0);
      if (error) alert(`Gagal mereset suara: ${error.message}`);
    }
  };

  const openAddModal = () => {
    setEditingCandidate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  if (loading && candidates.length === 0) return <div>Memuat data admin...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.headerActions}>
          <button onClick={openAddModal} className={styles.addButton}>+ Tambah Kandidat</button>
          <button onClick={handleResetVotes} className={styles.resetButton}>Reset Semua Vote</button>
        </div>
      </div>

      {isModalOpen && (
        <CandidateModal
          candidate={editingCandidate}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCandidate}
        />
      )}

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kandidat</th>
              <th>Total Suara</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>
                  <div className={styles.candidateCell}>
                    <img src={candidate.image || 'https://placehold.co/40x40'} alt={candidate.name} />
                    <span>{candidate.name}</span>
                  </div>
                </td>
                <td className={styles.votesCell}>{candidate.votes}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button onClick={() => openEditModal(candidate)} className={styles.editButton}>Edit</button>
                    <button onClick={() => handleDeleteCandidate(candidate.id)} className={styles.deleteButton}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;

