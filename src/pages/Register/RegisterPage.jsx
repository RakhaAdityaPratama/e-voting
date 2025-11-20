import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import styles from './RegisterPage.module.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError('Password harus terdiri dari minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/success`,
        },
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
        <h2 className={styles.title}>Buat Akun Baru</h2>
        <p className={styles.subtitle}>Daftar untuk memulai voting.</p>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        {success ? (
          <div className={styles.successMessage}>
            <p>Pendaftaran berhasil!</p>
            <p>Silakan cek email Anda untuk verifikasi akun.</p>
            <Link to="/" className={styles.loginLink}>Kembali ke Login</Link>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
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
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Konfirmasi Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Ulangi password"
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </form>
        )}

        {!success && (
          <div className={styles.links}>
            <span>
              Sudah punya akun? <Link to="/">Login di sini</Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
