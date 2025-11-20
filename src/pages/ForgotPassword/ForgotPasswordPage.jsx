import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/update-password', // URL untuk halaman update password
      });

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

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Lupa Password</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        {success ? (
          <div className={styles.successMessage}>
            <p>Permintaan reset password berhasil!</p>
            <p>Silakan cek email Anda untuk instruksi selanjutnya.</p>
            <Link to="/" className={styles.loginLink}>Kembali ke Login</Link>
          </div>
        ) : (
          <>
            <p className={styles.subtitle}>Masukkan email Anda untuk menerima link reset password.</p>
            <form onSubmit={handlePasswordReset}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contoh@email.com"
                />
              </div>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
            </form>
          </>
        )}

        {!success && (
          <div className={styles.links}>
            <span>
              Ingat password Anda? <Link to="/">Login di sini</Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
