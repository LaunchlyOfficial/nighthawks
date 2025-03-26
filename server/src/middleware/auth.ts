import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { User, AuthRequest } from '../types/auth.js';

export const validateAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as {
            id: number;
            username: string;
            role: string;
            full_name: string;
            last_login: string | null;
        };

        req.user = decoded;
        
        console.log('Decoded token:', decoded);
        console.log('User role:', decoded.role);
        
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

export const requireAnalyst = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.role) {
        return res.status(403).json({ error: 'Authentication required' });
    }
    next();
}; 