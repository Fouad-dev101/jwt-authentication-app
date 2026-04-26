// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    let token;
    
    // Try to get token from cookies first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // If not in cookies, try Authorization header
    else {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }
    
    if (!token) {
        return res.status(401).json({ 
            message: 'Access denied. No token provided.' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired. Please login again.' 
            });
        }
        return res.status(403).json({ 
            message: 'Invalid token.' 
        });
    }
};

// Optional: Role-based middleware
export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            message: 'Admin access required' 
        });
    }
};

export default authenticateToken;