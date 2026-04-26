// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await authService.getProfile();
            setProfile(response.data.user);
        } catch (error) {
            setError('Failed to load profile');
            console.error('Profile error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading profile...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>User Profile</h2>
                {profile && (
                    <div style={styles.profileInfo}>
                        <div style={styles.avatar}>
                            {profile.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.info}>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>User ID:</strong> {profile.id}</p>
                            <p><strong>Member since:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f5f5f5'
    },
    card: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333'
    },
    profileInfo: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
    },
    avatar: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: '#4CAF50',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        fontWeight: 'bold'
    },
    info: {
        flex: 1
    },
    loading: {
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '1.2rem',
        color: '#666'
    },
    error: {
        textAlign: 'center',
        marginTop: '3rem',
        fontSize: '1.2rem',
        color: '#f44336'
    }
};

export default Profile;