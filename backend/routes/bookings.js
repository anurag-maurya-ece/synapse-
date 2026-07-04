import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await db.bookings.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving bookings: ' + err.message });
  }
});

// POST submit a booking request
router.post('/', async (req, res) => {
  try {
    const { mentorId, mentorName, studentName, studentEmail, date, timeSlot, topic, description } = req.body;
    if (!mentorId || !mentorName || !studentName || !studentEmail || !date || !timeSlot || !topic || !description) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    const newBooking = await db.bookings.create({
      mentorId,
      mentorName,
      studentName,
      studentEmail,
      date,
      timeSlot,
      topic,
      description,
      status: 'Pending',
      createdAt: new Date().toISOString()
    });
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating booking: ' + err.message });
  }
});

// PATCH update booking status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['Pending', 'Approved', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status value' });
    }
    const updated = await db.bookings.findByIdAndUpdateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating booking status: ' + err.message });
  }
});

export default router;
