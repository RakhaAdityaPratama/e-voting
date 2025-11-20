import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from './UpdatePasswordPage.module.css';

function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Supabase's onAuthStateChange handles the session automatically
      // after the user clicks the magic link. We just need to update the password.
      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) {
        throw error;
      }
      setSuccess(true);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Password Diperbarui</h2>
          <p className={styles.subtitle}>Password Anda telah berhasil diubah.</p>
          <button onClick={() => navigate('/')} className={styles.submitButton}>
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Update Password</h2>
        <p className={styles.subtitle}>Masukkan password baru Anda.</p>
        
        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleUpdatePassword}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password Baru</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePasswordPage;
