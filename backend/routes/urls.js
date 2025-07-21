const express = require('express');
const shortid = require('shortid');
const validUrl = require('valid-url');
const jwt = require('jsonwebtoken');
const Url = require('../models/Url');

const router = express.Router();
const JWT_SECRET = 'your-secret-key';
const baseUrl = 'http://localhost:5000';

// Middleware to get user ID from token
const getUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return 'anonymous';
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return 'anonymous';
  }
};

// Shorten URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ message: 'Invalid URL' });
    }

    const userId = getUserId(req);
    const urlCode = shortid.generate();
    const shortUrl = `${baseUrl}/${urlCode}`;

    let url = await Url.findOne({ originalUrl, userId });
    if (url) {
      return res.json(url);
    }

    url = new Url({ originalUrl, shortUrl, urlCode, userId });
    await url.save();
    
    res.json(url);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/stats', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (userId === 'anonymous') {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const urls = await Url.find({ userId }).sort({ createdAt: -1 });
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    
    res.json({
      urls,
      totalUrls: urls.length,
      totalClicks
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;