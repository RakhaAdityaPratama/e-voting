import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateCard from '../../components/CandidateCard/CandidateCard';
import Modal from '../../components/Modal/Modal';
import styles from './VotingPage.module.css';
import { supabase } from '../../supabaseClient';

function VotingPage() {
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [modalCandidateId, setModalCandidateId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const { data, error } = await supabase.from('candidates').select('*');
        if (error) {
          throw error;
        }
        setCandidates(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  const handleVote = (candidateId) => {
    setSelectedCandidateId(candidateId);
  };

  const handleShowDetails = (candidateId) => {
    setModalCandidateId(candidateId);
  };

  const handleCloseModal = () => {
    setModalCandidateId(null);
  };

  const handleSelectFromModal = (candidateId) => {
    handleVote(candidateId);
    handleCloseModal();
  };

  const handleSubmitVote = async () => {
    if (selectedCandidateId) {
      try {
        const { data: currentCandidate, error: fetchError } = await supabase
          .from('candidates')
          .select('votes')
          .eq('id', selectedCandidateId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        const newVotes = currentCandidate.votes + 1;

        const { error: updateError } = await supabase
          .from('candidates')
          .update({ votes: newVotes })
          .eq('id', selectedCandidateId);

        if (updateError) {
          throw updateError;
        }

        navigate('/results');
      } catch (error) {
        alert(`Terjadi kesalahan: ${error.message}`);
      }
    } else {
      alert('Silakan pilih salah satu kandidat terlebih dahulu.');
    }
  };

  const modalCandidate = candidates.find(c => c.id === modalCandidateId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Pilih Kandidat Anda</h1>
      <div className={styles.candidatesGrid}>
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onVote={handleVote}
            onShowDetails={handleShowDetails}
            isSelected={selectedCandidateId === candidate.id}
          />
        ))}
      </div>
      <div className={styles.submitSection}>
        <button
          className={styles.submitButton}
          onClick={handleSubmitVote}
          disabled={!selectedCandidateId}
        >
          Kirim Suara
        </button>
      </div>

      <Modal
        candidate={modalCandidate}
        onClose={handleCloseModal}
        onSelect={handleSelectFromModal}
      />
    </div>
  );
}

export default VotingPage;
