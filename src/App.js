import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// Import Halaman Publik
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import UpdatePasswordPage from './pages/UpdatePassword/UpdatePasswordPage';
import SuccessPage from './pages/Success/SuccessPage';

// Import Layout dan Halaman yang Dilindungi
import ProtectedLayout from './components/ProtectedLayout/ProtectedLayout';
import Home from './pages/Home/Home';
import VotingPage from './pages/Voting/VotingPage';
import ResultsPage from './pages/Results/ResultsPage';
import AdminPage from './pages/Admin/AdminPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Rute Publik (Tanpa Navbar) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* Rute yang Dilindungi (Dengan Navbar dari ProtectedLayout) */}
          <Route 
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/voting" element={<VotingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/poiuqwerty" element={<AdminPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;