import { Router } from 'express';
import { query } from '../config/database.js';
import { validateAuth, requireAdmin } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

// Schema validation
const permissionRequestSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  websiteUrl: z.string().url("Please enter a valid URL"),
  contactInfo: z.string().email("Please enter a valid email address"),
  testingScope: z.string().min(3, "Please describe what you want to test"),
  categories: z.array(z.string())
    .optional()
    .default(['General'])
});

// Get all permission requests (admin only)
router.get('/', validateAuth, requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT pr.*, u.username as reviewed_by_username
      FROM permission_requests pr
      LEFT JOIN users u ON pr.reviewed_by = u.id
      ORDER BY pr.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching permission requests:', error);
    res.status(500).json({ error: 'Failed to fetch permission requests' });
  }
});

// Submit new permission request
router.post('/', async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    const data = permissionRequestSchema.parse({
      ...req.body,
      // Ensure categories is an array
      categories: req.body.categories 
        ? Array.isArray(req.body.categories) 
          ? req.body.categories 
          : [req.body.categories]
        : ['General']
    });
    
    console.log('Validated data:', data);
    
    const result = await query(
      `INSERT INTO permission_requests 
       (company_name, website_url, contact_info, testing_scope, categories) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [
        data.companyName,
        data.websiteUrl,
        data.contactInfo,
        data.testingScope,
        data.categories
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting permission request:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      });
    }
    res.status(500).json({ error: 'Failed to submit permission request' });
  }
});

// Update permission request status (admin only)
router.patch('/:id/status', validateAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await query(
      `UPDATE permission_requests 
       SET status = $1, reviewed_by = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [status, req.user?.id, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Permission request not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating permission status:', error);
    res.status(500).json({ error: 'Failed to update permission status' });
  }
});

export default router; 