import React from 'react';
import styles from './SuccessPage.module.css';

// SVG Checkmark Icon Component
const CheckmarkIcon = () => (
  <svg
    className={styles.checkmarkIcon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 52 52"
  >
    <circle
      className={styles.checkmarkCircle}
      cx="26"
      cy="26"
      r="25"
      fill="none"
    />
    <path
      className={styles.checkmarkCheck}
      fill="none"
      d="M14.1 27.2l7.1 7.2 16.7-16.8"
    />
  </svg>
);

function SuccessPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <CheckmarkIcon />
        <h1 className={styles.title}>Pendaftaran Berhasil</h1>
        <p className={styles.message}>
          Email Anda telah berhasil diverifikasi.
        </p>
        <p className={styles.message}>
          Silakan kembali ke halaman utama untuk login.
        </p>
      </div>
    </div>
  );
}

export default SuccessPage;
