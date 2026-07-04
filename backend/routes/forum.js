import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET all discussion forum posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await db.posts.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving posts: ' + err.message });
  }
});

// GET single post by ID
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await db.posts.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving post: ' + err.message });
  }
});

// POST create a forum post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, category, authorName, authorRole } = req.body;
    if (!title || !content || !category || !authorName) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    const newPost = await db.posts.create({
      title,
      content,
      category,
      authorName,
      authorRole: authorRole || 'Student',
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Server error creating post: ' + err.message });
  }
});

// POST upvote/like a post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const ip = req.ip || 'anonymous';
    const updated = await db.posts.like(req.params.id, ip);
    if (!updated) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error toggling like: ' + err.message });
  }
});

// POST comment on a post
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const { content, authorName, authorRole } = req.body;
    if (!content || !authorName) {
      return res.status(400).json({ error: 'Comment content and author are required' });
    }
    const updated = await db.posts.addComment(req.params.id, {
      content,
      authorName,
      authorRole: authorRole || 'Student',
      createdAt: new Date().toISOString()
    });
    if (!updated) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error adding comment: ' + err.message });
  }
});

export default router;
