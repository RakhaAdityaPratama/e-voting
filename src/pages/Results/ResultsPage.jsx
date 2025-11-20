import React, { useState, useEffect } from 'react';
import styles from './ResultsPage.module.css';
import { supabase } from '../../supabaseClient';

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [winners, setWinners] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .order('votes', { ascending: false });

        if (error) {
          throw error;
        }

        const total = data.reduce((sum, candidate) => sum + candidate.votes, 0);
        setTotalVotes(total);
        setResults(data);

        if (data.length > 0) {
          const maxVotes = data[0].votes;
          const currentWinners = data.filter(candidate => candidate.votes === maxVotes);
          setWinners(currentWinners);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (isLoading) {
    return <div className={styles.loading}>Memuat hasil...</div>;
  }

  if (totalVotes === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>Belum Ada Suara Masuk</h2>
        <p>Hasil voting akan ditampilkan di sini setelah ada suara yang masuk.</p>
        <button onClick={() => window.location.href = '/voting'} className={styles.voteNowButton}>
          Vote Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Hasil Akhir Voting</h1>
      </div>

      <div className={styles.winnerSection}>
        <h2 className={styles.winnerTitle}>
          {winners.length > 1 ? 'Pemenang Bersama' : 'Pemenang'}
        </h2>
        <div className={styles.winnerNames}>
          {winners.map((winner, index) => (
            <span key={winner.id} className={styles.winnerName}>
              {winner.name}
              {index < winners.length - 1 && ', '}
            </span>
          ))}
        </div>
        <p className={styles.winnerVotes}>dengan perolehan {winners.length > 0 ? winners[0].votes : 0} suara</p>
      </div>

      <div className={styles.resultsList}>
        <h3 className={styles.listTitle}>Rincian Suara</h3>
        {results.map(candidate => {
          const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100) : 0;
          return (
            <div key={candidate.id} className={styles.resultItem}>
              <div className={styles.candidateInfo}>
                <span className={styles.candidateName}>{candidate.name}</span>
                <span className={styles.voteCount}>{candidate.votes} Suara ({percentage.toFixed(1)}%)</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsPage;