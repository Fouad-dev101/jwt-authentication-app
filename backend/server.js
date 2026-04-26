// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // ← ADD THIS
import { authenticateToken } from './middleware/auth.js';
import { 
    signup, 
    getUsers, 
    login, 
    getProfile,
    logout,
    checkAuth
} from './controllers/userController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration (allow frontend to connect)
app.use(cors({
    origin: 'http://localhost:3001', // React app URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ==================== PUBLIC ROUTES ====================

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'JWT Authentication API',
        version: '1.0.0'
    });
});

app.post('/signup', signup);
app.post('/login', login);
app.get('/users', getUsers);
app.post('/logout', logout);

// ==================== PROTECTED ROUTES ====================

app.get('/profile', authenticateToken, getProfile);
app.get('/check-auth', authenticateToken, checkAuth);

// ==================== ERROR HANDLING ====================

app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: `Route ${req.method} ${req.url} not found` 
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong on the server!' 
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});