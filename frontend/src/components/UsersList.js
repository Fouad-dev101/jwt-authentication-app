// src/components/UsersList.js
import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await authService.getUsers();
            setUsers(response.data.users);
        } catch (error) {
            setError('Failed to load users');
            console.error('Users error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading users...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>All Users ({users.length})</h2>
                <div style={styles.usersList}>
                    {users.map(user => (
                        <div key={user.id} style={styles.userCard}>
                            <div style={styles.userAvatar}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div style={styles.userInfo}>
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                                <small>Joined: {new Date(user.createdAt).toLocaleDateString()}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        minHeight: '80vh'
    },
    card: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333'
    },
    usersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    userCard: {
        display: 'flex',
        gap: '1rem',
        padding: '1rem',
        border: '1px solid #eee',
        borderRadius: '8px',
        transition: 'box-shadow 0.3s'
    },
    userAvatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#2196F3',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    userInfo: {
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

export default UsersList;