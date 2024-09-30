const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Register route
router.post('/register', upload.single('collegeIdImage'), async (req, res) => {
  try {
    const { username, email, password, collegeId } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      collegeId,
      isAdmin: false
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('User from database:', user); // Add this line
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      console.log('User data being sent:', user); // Add this line for debugging
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          collegeId: user.collegeId, // Make sure this line is present
          isAdmin: user.isAdmin
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Register first admin route
router.post('/register-first-admin', async (req, res) => {
  try {
    const { username, email, password, collegeId } = req.body;

    // Check if there are any existing users
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.status(400).json({ message: 'First admin has already been registered' });
    }

    // Create new admin user
    const user = new User({
      username,
      email,
      password,
      collegeId,
      isAdmin: true
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'First admin registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
