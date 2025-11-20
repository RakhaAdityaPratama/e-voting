import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Selamat Datang di Aplikasi Voting</h1>
      <p className={styles.subtitle}>
        Suarakan pilihan Anda untuk masa depan yang lebih baik.
      </p>
      <Link to="/voting" className={styles.ctaButton}>
        Mulai Voting Sekarang
      </Link>
    </div>
  );
}

export default Home;