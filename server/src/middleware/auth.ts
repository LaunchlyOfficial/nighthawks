import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { User, AuthRequest } from '../types/auth.js';

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Validating auth...');
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('No token found');
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as User;
        console.log('Token decoded:', decoded);
        
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        console.error('Auth validation error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user || (authReq.user.role !== 'admin' && authReq.user.role !== 'super_admin')) {
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