// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is already logged in
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await authService.checkAuth();
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log('Not authenticated');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            setError(null);
            const response = await authService.signup(userData);
            if (response.data.success) {
                // Auto login after signup
                await login({ email: userData.email, password: userData.password });
                return { success: true };
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await authService.login(credentials);
            if (response.data.success) {
                setUser(response.data.user);
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
                return { success: true };
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            localStorage.removeItem('token');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false };
        }
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};