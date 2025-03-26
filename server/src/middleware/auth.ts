import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { User, AuthRequest } from '../types/auth.js';

export const validateAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as User;
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
    if (!['admin', 'super_admin'].includes(req.user?.role || '')) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

export const requireAnalyst = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!['analyst', 'admin', 'super_admin'].includes(req.user?.role || '')) {
        return res.status(403).json({ error: 'Analyst access required' });
    }
    next();
}; 