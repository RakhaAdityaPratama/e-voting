import React from 'react';
import styles from './CandidateCard.module.css';

function CandidateCard({ candidate, onVote, onShowDetails, isSelected }) {
  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      <img src={candidate.image} alt={candidate.name} className={styles.image} />
      <h3 className={styles.name}>{candidate.name}</h3>

      <div className={styles.buttonGroup}>
        <button 
          className={`${styles.button} ${styles.detailButton}`}
          onClick={() => onShowDetails(candidate.id)}
        >
          Lihat Detail
        </button>
        <button 
          className={`${styles.button} ${styles.voteButton}`} 
          onClick={() => onVote(candidate.id)}
          disabled={isSelected}
        >
          {isSelected ? 'Terpilih' : 'Pilih'}
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;
