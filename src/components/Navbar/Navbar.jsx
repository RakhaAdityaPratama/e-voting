import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        VotingApp
      </NavLink>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink 
            to="/" 
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
    </nav>
  );
}

export default Navbar;