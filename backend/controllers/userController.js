// controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

// POST /signup - Create a new user
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide name, email and password' 
            });
        }
        
        // Check password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }
        
        // Check if user already exists
        if (UserModel.exists(email)) {
            return res.status(400).json({ 
                message: 'User already exists with this email' 
            });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating user', 
            error: error.message 
        });
    }
};

// GET /users - Get all users
export const getUsers = (req, res) => {
    try {
        const users = UserModel.findAll();
        
        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching users', 
            error: error.message 
        });
    }
};

// POST /login - Authenticate user and return JWT
export const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide email and password' 
            });
        }
        
        // Check if user exists
        const user = UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name 
            },
            process.env.JWT_SECRET,
            { expiresIn: rememberMe ? '30d' : process.env.JWT_EXPIRE }
        );
        
        // Set cookie
        const cookieOptions = {
            httpOnly: true,  // Prevents XSS attacks
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'strict', // CSRF protection
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000 // 30 days or 7 days
        };
        
        res.cookie('token', token, cookieOptions);
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            message: 'Login successful',
            token, // Also return token for Postman testing
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error during login', 
            error: error.message 
        });
    }
};

// GET /profile - Get current user's profile (protected route)
export const getProfile = (req, res) => {
    try {
        const user = UserModel.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        // Remove password from response
        const { password, ...userProfile } = user;
        
        res.json({
            success: true,
            message: 'User profile retrieved successfully',
            user: userProfile
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching profile', 
            error: error.message 
        });
    }
};

// POST /logout - Logout user (clear cookie)
export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.json({ 
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error during logout', 
            error: error.message 
        });
    }
};

// GET /check-auth - Check if user is authenticated
export const checkAuth = (req, res) => {
    // This route is protected by middleware
    // If we get here, user is authenticated
    res.json({
        success: true,
        authenticated: true,
        user: req.user
    });
};