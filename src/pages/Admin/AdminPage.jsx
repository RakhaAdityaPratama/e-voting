import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './AdminPage.module.css';

// Komponen Modal untuk form Tambah/Edit
const CandidateModal = ({ candidate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    konsulat: '',
    visi: '',
    misi: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name || '',
        image: candidate.image || '',
        konsulat: candidate.konsulat || '',
        visi: candidate.visi || '',
        misi: candidate.misi || '',
      });
    } else {
      setFormData({ name: '', image: '', konsulat: '', visi: '', misi: '' });
    }
  }, [candidate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
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
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">URL Foto</label>
            <input type="url" id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.png" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="konsulat">Konsulat/Wilayah</label>
            <input type="text" id="konsulat" name="konsulat" value={formData.konsulat} onChange={handleChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="visi">Visi</label>
            <textarea id="visi" name="visi" value={formData.visi} onChange={handleChange} rows="3"></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="misi">Misi</label>
            <textarea id="misi" name="misi" value={formData.misi} onChange={handleChange} rows="5"></textarea>
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

  // Fungsi untuk mengambil data kandidat
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

  // Mengambil data saat komponen dimuat dan setup realtime listener
  useEffect(() => {
    fetchCandidates();

    const subscription = supabase
      .channel('candidates-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'candidates' },
        (payload) => {
          console.log('Change received!', payload);
          fetchCandidates(); // Ambil ulang semua data jika ada perubahan
        }
      )
      .subscribe();

    // Cleanup subscription saat komponen di-unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchCandidates]);

  // Fungsi CRUD
  const handleSaveCandidate = async (formData) => {
    if (editingCandidate) {
      // Update
      const { error } = await supabase
        .from('candidates')
        .update(formData)
        .eq('id', editingCandidate.id);
      if (error) throw error;
    } else {
      // Create
      const { error } = await supabase.from('candidates').insert([formData]);
      if (error) throw error;
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
      const { error } = await supabase.from('candidates').delete().eq('id', candidateId);
      if (error) {
        alert(`Gagal menghapus: ${error.message}`);
      }
    }
  };

  const handleResetVotes = async () => {
    if (window.confirm('PERINGATAN: Aksi ini akan mengatur ulang (reset) semua suara menjadi 0. Apakah Anda yakin?')) {
      const { error } = await supabase
        .from('candidates')
        .update({ votes: 0 })
        .neq('votes', 0); // Hanya update yang votes-nya bukan 0
      
      if (error) {
        alert(`Gagal mereset suara: ${error.message}`);
      }
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
