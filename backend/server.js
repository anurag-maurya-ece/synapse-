import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, db } from './db.js';
import mentorRoutes from './routes/mentors.js';
import bookingRoutes from './routes/bookings.js';
import forumRoutes from './routes/forum.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For development simplicity, allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/mentors', mentorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/auth', authRoutes);

// Newsletter Subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if already subscribed
    const existing = await db.subscribers.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'This email is already subscribed.' });
    }
    
    await db.subscribers.create(normalizedEmail);
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    message: 'Alumni Mentorship API is running smoothly.'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Alumni Mentorship Platform API. Use /api/mentors, /api/bookings, or /api/forum endpoints.');
});

// Initialization
const startServer = async () => {
  // Connect to DB (will fall back to JSON if Mongo is unavailable)
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`📡 Backend Server listening on http://localhost:${PORT}`);
  });
};

startServer();
