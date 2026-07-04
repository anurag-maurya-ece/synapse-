import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all mentors (with filters)
router.get('/', async (req, res) => {
  try {
    const { domain, search } = req.query;
    const mentors = await db.mentors.find({ domain, search });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving mentors: ' + err.message });
  }
});

// GET single mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const mentor = await db.mentors.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving mentor: ' + err.message });
  }
});

// POST create mentor profile
router.post('/', async (req, res) => {
  try {
    const { name, email, domain, experience, bio, availability, avatar, skills } = req.body;
    if (!name || !email || !domain || !experience || !bio) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    const newMentor = await db.mentors.create({
      name,
      email,
      domain,
      experience: Number(experience),
      bio,
      availability: availability || [],
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // placeholder
      skills: skills || []
    });
    res.status(201).json(newMentor);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating mentor: ' + err.message });
  }
});

// PUT update mentor profile
router.put('/:id', async (req, res) => {
  try {
    const updated = await db.mentors.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating mentor: ' + err.message });
  }
});

// DELETE mentor
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await db.mentors.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json({ message: 'Mentor profile deleted successfully', mentor: deleted });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting mentor: ' + err.message });
  }
});

export default router;
