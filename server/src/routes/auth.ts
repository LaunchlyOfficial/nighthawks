import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateAuth } from '../middleware/auth.js';
import { adminLimiter } from '../middleware/rateLimit.js';
import type { AuthRequest } from '../types/auth.js';
import type { Response } from 'express';

const router = Router();

// Apply admin limiter to admin routes
router.use(['/admins', '/create-admin'], adminLimiter);

// Hardcoded super admin for development
const SUPER_ADMIN = {
    id: 1,
    username: 'nighthawk_admin_2024',
    // This is a bcrypt hash of 'Password'
    password: '$2b$10$Zd4Ri6ryIN4eHX4RwGBwSuOn1szu6/Up7HugYTdMxubhWkpVqioYm',
    role: 'super_admin',
    full_name: 'Super Administrator'
};

// Mock admin list
let MOCK_ADMINS = [
    {
        id: 2,
        username: 'analyst1',
        role: 'analyst',
        full_name: 'Test Analyst',
        last_login: new Date().toISOString()
    },
    {
        id: 3,
        username: 'moderator1',
        role: 'moderator',
        full_name: 'Test Moderator',
        last_login: new Date().toISOString()
    }
];

// Get all admins
router.get('/admins', validateAuth, async (req, res) => {
    try {
        if (req.user?.role !== 'super_admin') {
            return res.status(403).json({ error: 'Super admin access required' });
        }
        res.json([...MOCK_ADMINS, {
            id: SUPER_ADMIN.id,
            username: SUPER_ADMIN.username,
            role: SUPER_ADMIN.role,
            full_name: SUPER_ADMIN.full_name,
            last_login: new Date().toISOString()
        }]);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

// Create new admin
router.post('/create-admin', validateAuth, async (req, res) => {
    try {
        if (req.user?.role !== 'super_admin') {
            return res.status(403).json({ error: 'Super admin access required' });
        }

        const { username, password, role, full_name } = req.body;

        // Validate input
        if (!username || !password || !role || !full_name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if username already exists
        if (MOCK_ADMINS.some(admin => admin.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create new admin
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = {
            id: MOCK_ADMINS.length + 10, // Simple ID generation
            username,
            role,
            full_name,
            last_login: null
        };

        MOCK_ADMINS.push(newAdmin);

        res.status(201).json(newAdmin);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ error: 'Failed to create admin' });
    }
});

// Update admin status
router.patch('/admins/:id', validateAuth, async (req, res) => {
    try {
        if (req.user?.role !== 'super_admin') {
            return res.status(403).json({ error: 'Super admin access required' });
        }

        const { id } = req.params;
        const { active } = req.body;

        const adminIndex = MOCK_ADMINS.findIndex(admin => admin.id === parseInt(id));
        if (adminIndex === -1) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        MOCK_ADMINS[adminIndex] = {
            ...MOCK_ADMINS[adminIndex],
            is_active: active
        };

        res.json(MOCK_ADMINS[adminIndex]);
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ error: 'Failed to update admin' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username }); // Add logging

        // Check against hardcoded super admin
        if (username === SUPER_ADMIN.username) {
            const validPassword = await bcrypt.compare(password, SUPER_ADMIN.password);
            console.log('Password check:', { validPassword }); // Add logging
            
            if (validPassword) {
                const token = jwt.sign(
                    { 
                        id: SUPER_ADMIN.id, 
                        role: SUPER_ADMIN.role,
                        username: SUPER_ADMIN.username
                    },
                    process.env.JWT_SECRET || 'default_secret'
                );
                return res.json({ 
                    token,
                    user: {
                        id: SUPER_ADMIN.id,
                        username: SUPER_ADMIN.username,
                        role: SUPER_ADMIN.role,
                        full_name: SUPER_ADMIN.full_name
                    }
                });
            }
        }

        res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get current user
router.get('/me', validateAuth, async (req: AuthRequest, res: Response) => {
    try {
        // Return hardcoded super admin info
        if (req.user?.role === 'super_admin') {
            return res.json({
                id: SUPER_ADMIN.id,
                username: SUPER_ADMIN.username,
                role: SUPER_ADMIN.role,
                full_name: SUPER_ADMIN.full_name
            });
        }
        res.status(404).json({ error: 'User not found' });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Add this route to handle admin deletion
router.delete('/admins/:id', validateAuth, async (req, res) => {
    try {
        if (req.user?.role !== 'super_admin') {
            return res.status(403).json({ error: 'Super admin access required' });
        }

        const { id } = req.params;
        const adminIndex = MOCK_ADMINS.findIndex(admin => admin.id === parseInt(id));
        
        if (adminIndex === -1) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Remove the admin from the list
        MOCK_ADMINS.splice(adminIndex, 1);
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ error: 'Failed to delete admin' });
    }
});

export default router; 