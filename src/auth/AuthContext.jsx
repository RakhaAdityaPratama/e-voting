import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil sesi yang sudah ada jika ada
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Dengarkan perubahan status otentikasi
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (_event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Cleanup listener saat komponen di-unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user || null,
  };

  // Tampilkan loading screen jika sesi sedang dimuat
  if (loading) {
    return <div>Loading session...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook custom untuk menggunakan context
export function useAuth() {
  return useContext(AuthContext);
}
