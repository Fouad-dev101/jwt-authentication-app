// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import UsersList from './components/UsersList';
import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

// Public Route wrapper (redirect if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    
    if (isAuthenticated) {
        return <Navigate to="/profile" />;
    }
    
    return children;
};

function AppContent() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <div className="home">
                        <h1>Welcome to JWT Authentication App</h1>
                        <p>A complete authentication system with JWT tokens and cookies</p>
                        <div className="features">
                            <div className="feature-card">
                                <h3>🔐 Secure Authentication</h3>
                                <p>JWT tokens with httpOnly cookies</p>
                            </div>
                            <div className="feature-card">
                                <h3>👤 User Profiles</h3>
                                <p>View and manage your profile</p>
                            </div>
                            <div className="feature-card">
                                <h3>📋 User List</h3>
                                <p>See all registered users</p>
                            </div>
                        </div>
                    </div>
                } />
                
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                
                <Route path="/signup" element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                } />
                
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                
                <Route path="/users" element={
                    <ProtectedRoute>
                        <UsersList />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;