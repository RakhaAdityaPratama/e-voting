import React from 'react';
import styles from './Modal.module.css';

function Modal({ candidate, onClose, onSelect }) {
  if (!candidate) {
    return null;
  }

  const handleSelect = () => {
    onSelect(candidate.id);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img src={candidate.image} alt={candidate.name} className={styles.image} />
        <h2 className={styles.name}>{candidate.name}</h2>
        <p className={styles.konsulat}>{candidate.konsulat}</p>
        
        <div className={styles.detailsSection}>
          <h3>Visi</h3>
          <p>{candidate.visi}</p>
          <h3>Misi</h3>
          <p>{candidate.misi}</p>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={`${styles.button} ${styles.closeButton}`}>
            Tutup
          </button>
          <button onClick={handleSelect} className={`${styles.button} ${styles.selectButton}`}>
            Pilih Kandidat Ini
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
