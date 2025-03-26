import { Router } from 'express';
import { query } from '../config/database.js';
import { validateAuth, requireAdmin } from '../middleware/auth.js';
import type { AuthRequest } from '../types/auth.js';
import type { Response } from 'express';

const router = Router();

// Mock data for development
const MOCK_REQUESTS = [
    {
        id: 1,
        full_name: "Jane Smith",
        email: "jane@example.com",
        position: "Security Analyst",
        experience: "5 years in cybersecurity",
        skills: ["Incident Response", "Malware Analysis", "SIEM"],
        motivation: "Passionate about protecting organizations from cyber threats",
        status: "pending",
        created_at: new Date().toISOString()
    }
];

// Submit join request (public)
router.post('/submit', async (req, res) => {
    try {
        const { full_name, email, position, experience, skills, motivation } = req.body;

        // Validate input
        if (!full_name || !email || !position || !experience || !skills || !motivation) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Try database first
        try {
            const result = await query(
                `INSERT INTO join_requests 
                 (full_name, email, position, experience, skills, motivation) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 RETURNING *`,
                [full_name, email, position, experience, skills, motivation]
            );
            return res.status(201).json(result.rows[0]);
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            // Fall back to mock data
            const newRequest = {
                id: MOCK_REQUESTS.length + 1,
                full_name,
                email,
                position,
                experience,
                skills,
                motivation,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            MOCK_REQUESTS.push(newRequest);
            return res.status(201).json(newRequest);
        }
    } catch (error) {
        console.error('Error submitting request:', error);
        res.status(500).json({ error: 'Failed to submit request' });
    }
});

// Get all join requests (admin only)
router.get('/', validateAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // Try database first
        try {
            const result = await query(
                `SELECT r.*, u.username as reviewer_name 
                 FROM join_requests r 
                 LEFT JOIN users u ON r.reviewed_by = u.id 
                 ORDER BY r.created_at DESC`
            );
            return res.json(result.rows);
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            return res.json(MOCK_REQUESTS);
        }
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Update join request status (admin only)
router.patch('/:id', validateAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Try database first
        try {
            const result = await query(
                `UPDATE join_requests 
                 SET status = $1, 
                     reviewer_notes = $2,
                     reviewed_by = $3,
                     updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $4 
                 RETURNING *`,
                [status, notes, req.user?.id, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Request not found' });
            }

            return res.json(result.rows[0]);
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            const requestIndex = MOCK_REQUESTS.findIndex(r => r.id === parseInt(id));
            if (requestIndex === -1) {
                return res.status(404).json({ error: 'Request not found' });
            }
            MOCK_REQUESTS[requestIndex].status = status;
            return res.json(MOCK_REQUESTS[requestIndex]);
        }
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ error: 'Failed to update request' });
    }
});

export default router; 