import { Router } from 'express';
import { query } from '../config/database.js';
import { validateAuth, requireAdmin, requireAnalyst } from '../middleware/auth.js';
import type { AuthRequest } from '../types/auth.js';
import type { Response } from 'express';
import { z } from 'zod';

const router = Router();

// Public endpoints
router.post('/submit-report', async (req, res) => {
  try {
    const { name, email, incidentType, description, evidence } = req.body;
    
    // Validate input
    if (!name || !email || !incidentType || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert into database
    const result = await query(
      `INSERT INTO crime_reports 
       (name, email, incident_type, description, evidence, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, email, incidentType, description, evidence, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get report status
router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, status, created_at FROM crime_reports WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching report status:', error);
    res.status(500).json({ error: 'Failed to fetch report status' });
  }
});

// Protected admin endpoints
router.get('/admin/reports', validateAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM crime_reports ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get report statistics
router.get('/admin/stats', validateAuth, requireAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_reports,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reports,
        COUNT(CASE WHEN status = 'investigating' THEN 1 END) as investigating_reports,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_reports
      FROM crime_reports
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Mock data for development
const MOCK_REPORTS = [
    {
        id: 1,
        title: 'Suspicious Network Activity',
        description: 'Multiple failed login attempts detected',
        status: 'investigating',
        type: 'Security Breach',
        reporter_id: 2,
        assigned_to: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Phishing Campaign Detected',
        description: 'Mass phishing emails targeting employees',
        status: 'pending',
        type: 'Phishing',
        reporter_id: 3,
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

// Get all reports
router.get('/', validateAuth, requireAnalyst, async (req: AuthRequest, res: Response) => {
    try {
        // Try database first
        try {
            const result = await query('SELECT * FROM reports ORDER BY created_at DESC');
            return res.json(result.rows);
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            // Fall back to mock data if database not ready
            return res.json(MOCK_REPORTS);
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// Get report by ID
router.get('/:id', validateAuth, requireAnalyst, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try database first
        try {
            const result = await query('SELECT * FROM reports WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                // Fall back to mock data if not found in DB
                const mockReport = MOCK_REPORTS.find(r => r.id === parseInt(id));
                if (!mockReport) {
                    return res.status(404).json({ error: 'Report not found' });
                }
                return res.json(mockReport);
            }
            return res.json(result.rows[0]);
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            // Fall back to mock data
            const mockReport = MOCK_REPORTS.find(r => r.id === parseInt(id));
            if (!mockReport) {
                return res.status(404).json({ error: 'Report not found' });
            }
            return res.json(mockReport);
        }
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ error: 'Failed to fetch report' });
    }
});

// Update report status
router.patch('/:id/status', validateAuth, requireAnalyst, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'investigating', 'resolved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Try database first
        try {
            const result = await query(
                `UPDATE reports 
                 SET status = $1, 
                     updated_at = CURRENT_TIMESTAMP,
                     assigned_to = $2
                 WHERE id = $3 
                 RETURNING *`,
                [status, req.user?.id, id]
            );

            if (result.rows.length === 0) {
                // Fall back to mock data
                const reportIndex = MOCK_REPORTS.findIndex(r => r.id === parseInt(id));
                if (reportIndex === -1) {
                    return res.status(404).json({ error: 'Report not found' });
                }
                MOCK_REPORTS[reportIndex].status = status;
                MOCK_REPORTS[reportIndex].assigned_to = req.user?.id;
                MOCK_REPORTS[reportIndex].updated_at = new Date().toISOString();
                return res.json(MOCK_REPORTS[reportIndex]);
            }

            return res.json(result.rows[0]);
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            // Fall back to mock data
            const reportIndex = MOCK_REPORTS.findIndex(r => r.id === parseInt(id));
            if (reportIndex === -1) {
                return res.status(404).json({ error: 'Report not found' });
            }
            MOCK_REPORTS[reportIndex].status = status;
            MOCK_REPORTS[reportIndex].assigned_to = req.user?.id;
            MOCK_REPORTS[reportIndex].updated_at = new Date().toISOString();
            return res.json(MOCK_REPORTS[reportIndex]);
        }
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ error: 'Failed to update report' });
    }
});

// Add mock comments data
const MOCK_COMMENTS = [
    {
        id: 1,
        report_id: 1,
        user_id: 1,
        content: "Started investigation on suspicious activity",
        created_at: new Date().toISOString(),
        username: "nighthawk_admin_2024"
    }
];

// Get comments for a report (analyst+)
router.get('/:id/comments', validateAuth, requireAnalyst, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try database first
        try {
            const result = await query(
                `SELECT c.*, u.username 
                 FROM comments c 
                 LEFT JOIN users u ON c.user_id = u.id 
                 WHERE c.report_id = $1 
                 ORDER BY c.created_at DESC`,
                [id]
            );
            return res.json(result.rows);
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            // Fall back to mock data
            const mockComments = MOCK_COMMENTS.filter(c => c.report_id === parseInt(id));
            return res.json(mockComments);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Add comment to a report (analyst+)
router.post('/:id/comments', validateAuth, requireAnalyst, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content?.trim()) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        // Try database first
        try {
            const result = await query(
                `INSERT INTO comments (report_id, user_id, content) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [id, req.user?.id, content]
            );

            // Try to fetch the username
            try {
                const commentWithUser = await query(
                    `SELECT c.*, u.username 
                     FROM comments c 
                     LEFT JOIN users u ON c.user_id = u.id 
                     WHERE c.id = $1`,
                    [result.rows[0].id]
                );
                return res.status(201).json(commentWithUser.rows[0]);
            } catch (userError) {
                // If we can't get the username, just return the comment
                return res.status(201).json({
                    ...result.rows[0],
                    username: 'Unknown User'
                });
            }
        } catch (dbError) {
            console.log('Using mock data due to DB error:', dbError);
            // Fall back to mock data
            const newComment = {
                id: MOCK_COMMENTS.length + 1,
                report_id: parseInt(id),
                user_id: req.user?.id,
                content,
                created_at: new Date().toISOString(),
                username: req.user?.username || 'Unknown User'
            };
            MOCK_COMMENTS.push(newComment);
            return res.status(201).json(newComment);
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Get dashboard stats
router.get('/stats', validateAuth, requireAnalyst, async (req: AuthRequest, res: Response) => {
    try {
        // Generate mock data for development
        const mockData = {
            total_reports: 150,
            pending_reports: 45,
            investigating_reports: 65,
            resolved_reports: 40,
            timeline: Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return {
                    date: date.toISOString().split('T')[0],
                    count: Math.floor(Math.random() * 10)
                };
            }).reverse(),
            recent_activity: [
                {
                    type: 'New Report',
                    description: 'Phishing attempt reported',
                    timestamp: new Date()
                },
                {
                    type: 'Status Update',
                    description: 'Investigation started for case #123',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30)
                }
            ],
            reports_by_type: {
                'Phishing': 45,
                'Malware': 30,
                'Data Breach': 25,
                'DDoS': 15,
                'Other': 35
            }
        };

        res.json(mockData);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router; 