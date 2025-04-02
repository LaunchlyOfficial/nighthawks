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

// Get all reports (admin only)
router.get('/', validateAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        console.log('Fetching reports...');
        
        // First check if the table exists
        const tableCheck = await query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name = 'crime_reports'
            );
        `);

        if (!tableCheck.rows[0].exists) {
            console.error('crime_reports table does not exist');
            return res.status(500).json({ 
                error: 'Database not properly initialized',
                details: 'Required tables are missing'
            });
        }
        
        const result = await query(`
            SELECT r.*, 
                   u.username as reviewer_name
            FROM crime_reports r
            LEFT JOIN users u ON r.reviewed_by = u.id
            ORDER BY r.created_at DESC
        `);
        
        console.log('Found reports:', result.rows.length);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ 
            error: 'Failed to fetch reports',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get report by ID
router.get('/:id', validateAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM crime_reports WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Update report status (admin only)
router.patch('/:id/status', validateAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'investigating', 'resolved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await query(
            `UPDATE crime_reports 
             SET status = $1, 
                 reviewed_by = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 
             RETURNING *`,
            [status, req.user?.id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json(result.rows[0]);
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

// Add comment to report (admin only)
router.post('/:id/comments', validateAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const result = await query(
            `INSERT INTO comments (report_id, user_id, content)
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [id, req.user?.id, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

// Add this endpoint to get dashboard stats
router.get('/stats', validateAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // Get basic stats
        const basicStats = await query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'investigating') as investigating,
                COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
                COUNT(*) FILTER (WHERE status = 'rejected') as rejected
            FROM crime_reports
        `);

        // Get monthly trends (last 6 months)
        const monthlyTrends = await query(`
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM crime_reports
            WHERE created_at >= NOW() - INTERVAL '6 months'
            GROUP BY month
            ORDER BY month DESC
            LIMIT 6
        `);

        // Get annual data
        const annualData = await query(`
            SELECT 
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM crime_reports
            WHERE created_at >= NOW() - INTERVAL '1 year'
            GROUP BY month
            ORDER BY month ASC
        `);

        // Calculate completion rate
        const completionRate = await query(`
            SELECT 
                ROUND(
                    (COUNT(*) FILTER (WHERE status = 'resolved')::float / 
                    NULLIF(COUNT(*), 0) * 100)::numeric, 
                    2
                ) as rate
            FROM crime_reports
            WHERE created_at >= NOW() - INTERVAL '30 days'
        `);

        // Get performance metrics
        const performance = await query(`
            SELECT
                ROUND((COUNT(*) FILTER (WHERE status != 'pending')::float / 
                    NULLIF(COUNT(*), 0) * 100)::numeric, 2) as response_rate,
                ROUND((COUNT(*) FILTER (WHERE status = 'resolved')::float / 
                    NULLIF(COUNT(*), 0) * 100)::numeric, 2) as resolution_rate
            FROM crime_reports
            WHERE created_at >= NOW() - INTERVAL '30 days'
        `);

        res.json({
            basic: basicStats.rows[0],
            monthlyTrends: monthlyTrends.rows,
            annualData: annualData.rows,
            completionRate: completionRate.rows[0].rate,
            performance: performance.rows[0]
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
});

// Add this endpoint for deleting reports
router.delete('/:id', validateAuth, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        
        // First check if report exists
        const checkResult = await query(
            'SELECT id FROM crime_reports WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Delete associated comments first (due to foreign key constraint)
        await query('DELETE FROM comments WHERE report_id = $1', [id]);
        
        // Then delete the report
        await query('DELETE FROM crime_reports WHERE id = $1', [id]);

        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ error: 'Failed to delete report' });
    }
});

export default router; 