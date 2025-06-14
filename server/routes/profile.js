const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configure multer for image storage
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'avatar_' + Date.now() + ext);
  },
});
const upload = multer({ storage });

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded; // save decoded user info in req.user
    next();
  });
}

// GET user profile
router.get('/', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM user_profiles WHERE user_id = ?';
  db.query(sql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0] || {});
  });
});

router.post('/setup', upload.single('avatar'), (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    const {
      username, skills, bio, birthday,
      gender, social_links, contact_number
    } = req.body;

    const avatar = req.file?.filename;

    // Check if user profile already exists
    const checkSql = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(checkSql, [decoded.id], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        // 🛠 Update existing profile
        let sql = `
          UPDATE user_profiles 
          SET username=?, skills=?, bio=?, birthday=?, gender=?, social_links=?, contact_number=?`;
        const values = [username, skills, bio, birthday, gender, social_links, contact_number];

        if (avatar) {
          sql += `, avatar=?`;
          values.push(avatar);
        }

        sql += ` WHERE user_id=?`;
        values.push(decoded.id);

        db.query(sql, values, (err2) => {
          if (err2) return res.status(500).json({ error: err2 });
          res.json({ message: 'Profile updated' });
        });

      } else {
        // ➕ Insert new profile
        const sql = `
          INSERT INTO user_profiles 
          (user_id, username, skills, bio, birthday, gender, social_links, contact_number, avatar) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [
          decoded.id, username, skills, bio, birthday,
          gender, social_links, contact_number, avatar || null
        ], (err3) => {
          if (err3) return res.status(500).json({ error: err3 });
          res.json({ message: 'Profile created' });
        });
      }
    });
  });
});

// Upload avatar only
router.post('/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No avatar uploaded' });

  const avatar = req.file.filename;
  const checkSql = 'SELECT * FROM user_profiles WHERE user_id = ?';
  db.query(checkSql, [req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length > 0) {
      const updateSql = 'UPDATE user_profiles SET avatar = ? WHERE user_id = ?';
      db.query(updateSql, [avatar, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Avatar updated successfully' });
      });
    } else {
      const insertSql = 'INSERT INTO user_profiles (user_id, avatar) VALUES (?, ?)';
      db.query(insertSql, [req.user.id, avatar], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Avatar saved successfully' });
      });
    }
  });
});

module.exports = router;
