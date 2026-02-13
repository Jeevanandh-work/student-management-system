const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, studentId: user.studentId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new student (creates both User and Student records)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, rollNumber, department, year, phone, dateOfBirth, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if roll number exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    // Create student record
    const student = new Student({
      rollNumber,
      name,
      email,
      phone,
      department,
      year,
      dateOfBirth,
      address
    });
    await student.save();

    // Create user account
    const user = new User({
      email,
      password,
      role: 'student',
      studentId: student._id
    });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        studentId: student._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Create admin account (protected by secret)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, secret } = req.body;

    // Verify admin secret
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin secret' });
    }

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create admin user
    const admin = new User({
      email,
      password,
      role: 'admin'
    });
    await admin.save();

    const token = generateToken(admin);

    res.status(201).json({
      message: 'Admin account created successfully',
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Admin creation failed', error: error.message });
  }
});

module.exports = router;
