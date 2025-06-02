const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkEmailSql = 'SELECT email FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error during email check' });
      }

      if (result.length > 0) {
        return res.status(409).json({ 
          error: 'Email already registered',
          code: 'EMAIL_EXISTS'
        });
      }
      const hashed = await bcrypt.hash(password, 10);
      const insertSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      
      db.query(insertSql, [name, email, hashed], (err, result) => {
        if (err) {
          return res.status(500).json({ 
            error: 'Registration failed',
            details: err.message 
          });
        }
        res.status(201).json({ 
          message: 'Registered successfully',
          userId: result.insertId 
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration process failed',
      details: error.message 
    });
  }
});

const jwt = require('jsonwebtoken');
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, result[0].password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    try {
      const token = jwt.sign(
        { id: result[0].id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      res.json({ 
        token, 
        user: { 
          id: result[0].id, 
          name: result[0].name, 
          email: result[0].email 
        } 
      });
    } catch (jwtError) {
      console.error('JWT Error:', jwtError);
      res.status(500).json({ error: 'Authentication error' });
    }
  });
});


module.exports = router;
