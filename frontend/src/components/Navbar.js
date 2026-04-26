// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    JWT Auth App
                </Link>
                <div style={styles.navLinks}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" style={styles.link}>Profile</Link>
                            <Link to="/users" style={styles.link}>Users</Link>
                            <span style={styles.userName}>Welcome, {user?.name}</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.link}>Login</Link>
                            <Link to="/signup" style={styles.link}>Signup</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '1rem',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none'
    },
    navLinks: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        padding: '0.5rem',
        borderRadius: '4px',
        transition: 'background-color 0.3s'
    },
    userName: {
        color: '#4CAF50',
        marginLeft: '1rem'
    },
    logoutBtn: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '1rem'
    }
};

export default Navbar;