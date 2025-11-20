import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useAuth } from '../../auth/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (session) {
      // Periksa apakah ini adalah callback dari link verifikasi email
      const hash = window.location.hash;
      if (hash.includes('type=signup')) {
        // Jika ya, arahkan ke halaman sukses
        navigate('/success', { replace: true });
      } else {
        // Jika tidak (login biasa atau sesi sudah ada), arahkan ke home
        navigate('/home', { replace: true });
      }
    }
  }, [session, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      
      // Redirect akan ditangani oleh useEffect di atas
      // navigate('/home');

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Jangan render form jika sesi sedang diproses untuk redirect
  if (session) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>Selamat datang kembali! Silakan masuk ke akun Anda.</p>
        
        {error && <p className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleLogin}>
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
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Memuat...' : 'Login'}
          </button>
        </form>
        <div className={styles.links}>
          <Link to="/forgot-password">Lupa Password?</Link>
          <span>
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
