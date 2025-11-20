import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <main className="container">
        {/* Konten dari nested route akan dirender di sini */}
        <Outlet />
      </main>
    </>
  );
}

export default ProtectedLayout;
