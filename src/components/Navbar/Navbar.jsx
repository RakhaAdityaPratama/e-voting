import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../supabaseClient';

function Navbar() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Redirect to login page after logout
  };

  // Do not render Navbar if there is no session (e.g., on login, register pages)
  if (!session) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <NavLink to="/home" className={styles.brand}>
        VotingApp
      </NavLink>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink 
            to="/home" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Home
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink 
            to="/voting" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Voting
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink 
            to="/results" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Results
          </NavLink>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;