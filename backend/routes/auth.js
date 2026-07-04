import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'synapse-super-secret-key-12345';

// POST Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Strong password check: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (e.g. @$!%*?&#).' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user exists
    const existingUser = await db.users.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Determine role (default to student, allow admin if specified)
    const userRole = role === 'admin' ? 'admin' : 'student';

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Save user
    const newUser = await db.users.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: userRole
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error registering user: ' + err.message });
  }
});

// POST Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter all fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check user
    const user = await db.users.findByEmail(normalizedEmail);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Match password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error logging in: ' + err.message });
  }
});

export default router;
