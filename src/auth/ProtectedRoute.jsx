import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { session } = useAuth();

  if (!session) {
    // Jika tidak ada sesi (user belum login), redirect ke halaman login
    return <Navigate to="/" replace />;
  }

  // Jika sudah login, tampilkan komponen anak (halaman yang dituju)
  return children;
}

export default ProtectedRoute;
