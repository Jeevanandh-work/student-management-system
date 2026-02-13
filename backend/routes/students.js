const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Student = require('../models/Student');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image and PDF files are allowed'));
  }
});

// Get all students (with search and filter)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, department, year, status } = req.query;
    let query = {};

    // Search by name, email, or roll number
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by year
    if (year) {
      query.year = parseInt(year);
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students', error: error.message });
  }
});

// Get statistics (Admin only) - MUST come before /:id
router.get('/stats/overview', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const departments = await Student.distinct('department');
    
    // Calculate pass percentage (students with avg grade >= 50)
    const students = await Student.find({});
    let passCount = 0;
    students.forEach(student => {
      if (student.grades.length > 0) {
        const avgMarks = student.grades.reduce((sum, g) => sum + g.marks, 0) / student.grades.length;
        if (avgMarks >= 50) passCount++;
      }
    });
    const passPercentage = students.length > 0 ? (passCount / students.length * 100).toFixed(2) : 0;

    res.json({
      totalStudents,
      activeStudents,
      departments: departments.length,
      passPercentage
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

// Get single student by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Students can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch student', error: error.message });
  }
});

// Create new student (Admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
});

// Update student
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Students can only update their own profile (limited fields)
    if (req.user.role !== 'admin') {
      if (student._id.toString() !== req.user.studentId?.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // Students can only update certain fields
      const allowedFields = ['phone', 'address', 'email', 'department'];
      const updates = {};
      allowedFields.forEach(field => {
        if (req.body[field]) updates[field] = req.body[field];
      });
      Object.assign(student, updates);
    } else {
      // Admin can update all fields
      Object.assign(student, req.body);
    }

    await student.save();
    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update student', error: error.message });
  }
});

// Delete student (Admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete student', error: error.message });
  }
});

// Upload photo
router.post('/:id/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    student.photo = req.file.path;
    await student.save();

    res.json({ message: 'Photo uploaded successfully', photoPath: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload photo', error: error.message });
  }
});

// ============= Project Management Routes =============

// Add project
router.post('/:id/projects', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Students can only add to their own profile
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    student.projects.push(req.body);
    await student.save();
    res.json({ message: 'Project added successfully', project: student.projects[student.projects.length - 1] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add project', error: error.message });
  }
});

// Update project
router.put('/:id/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const project = student.projects.id(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(project, req.body);
    await student.save();
    res.json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message });
  }
});

// Delete project
router.delete('/:id/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    student.projects.pull(req.params.projectId);
    await student.save();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

// ============= Library Management Routes =============

// Borrow book
router.post('/:id/library/borrow', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days borrowing period

    student.libraryBooks.push({
      ...req.body,
      dueDate,
      status: 'borrowed'
    });
    await student.save();
    res.json({ message: 'Book borrowed successfully', book: student.libraryBooks[student.libraryBooks.length - 1] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to borrow book', error: error.message });
  }
});

// Return book
router.put('/:id/library/:bookId/return', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const book = student.libraryBooks.id(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.returnedDate = new Date();
    book.status = 'returned';

    // Calculate fine if overdue
    if (new Date() > book.dueDate) {
      const daysOverdue = Math.floor((new Date() - book.dueDate) / (1000 * 60 * 60 * 24));
      book.fine = daysOverdue * 5; // $5 per day fine
    }

    await student.save();
    res.json({ message: 'Book returned successfully', book });
  } catch (error) {
    res.status(500).json({ message: 'Failed to return book', error: error.message });
  }
});

// Get borrowed books
router.get('/:id/library/borrowed', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check permission
    if (req.user.role !== 'admin' && student._id.toString() !== req.user.studentId?.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update overdue status
    const now = new Date();
    student.libraryBooks.forEach(book => {
      if (book.status === 'borrowed' && now > book.dueDate) {
        book.status = 'overdue';
      }
    });
    await student.save();

    const borrowedBooks = student.libraryBooks.filter(book => book.status === 'borrowed' || book.status === 'overdue');
    res.json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch borrowed books', error: error.message });
  }
});

// ============= Grades Management Routes =============

// Add grade (Admin only)
router.post('/:id/grades', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.grades.push(req.body);
    await student.save();
    res.json({ message: 'Grade added successfully', grade: student.grades[student.grades.length - 1] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add grade', error: error.message });
  }
});

// Update grade (Admin only)
router.put('/:id/grades/:gradeId', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const grade = student.grades.id(req.params.gradeId);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    Object.assign(grade, req.body);
    await student.save();
    res.json({ message: 'Grade updated successfully', grade });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update grade', error: error.message });
  }
});

// Delete grade (Admin only)
router.delete('/:id/grades/:gradeId', authMiddleware, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.grades.pull(req.params.gradeId);
    await student.save();
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete grade', error: error.message });
  }
});

module.exports = router;
