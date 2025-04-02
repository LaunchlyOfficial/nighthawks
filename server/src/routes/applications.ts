import { Router } from 'express';
import { query } from '../config/database.js';
import { validateAuth, requireAdmin } from '../middleware/auth.js';
import { z } from 'zod';
import express from 'express';
import { insertApplicationSchema } from '../schema.js';

const router = Router();

// Get all applications (admin only)
router.get('/admin', validateAuth, requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM applications ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Submit new application
router.post('/', async (req, res) => {
  try {
    const data = insertApplicationSchema.parse(req.body);
    
    const result = await query(
      `INSERT INTO applications 
       (name, email, position, experience, skills, motivation) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [data.name, data.email, data.position, data.experience, data.skills, data.motivation]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Add this endpoint to handle status updates
router.patch('/:id/status', validateAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('Updating application status:', { id, status }); // Debug log

    // Validate status value
    if (!['new', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const result = await query(
      `UPDATE applications 
       SET status = $1, 
           updated_at = CURRENT_TIMESTAMP,
           reviewed_by = $2
       WHERE id = $3 
       RETURNING *`,
      [status, req.user?.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router; 