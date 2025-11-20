import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import VotingPage from './pages/Voting/VotingPage';
import ResultsPage from './pages/Results/ResultsPage';
import AdminPage from './pages/Admin/AdminPage'; // Impor halaman Admin
import './App.css'; // Anda bisa gunakan ini untuk style global

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Fade triggerOnce>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/voting" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/poiuqwerty" element={<AdminPage />} /> {/* Tambahkan rute admin di sini */}
          </Routes>
        </Fade>
      </main>
    </div>
  );
}

export default App;