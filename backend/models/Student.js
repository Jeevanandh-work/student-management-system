const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    type: String,
    trim: true
  },
  photo: {
    type: String // File path for uploaded photo
  },
  grades: [{
    subject: String,
    marks: Number,
    grade: String,
    semester: Number,
    credits: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    technologies: [String],
    githubLink: String,
    liveLink: String,
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'submitted'],
      default: 'ongoing'
    },
    grade: String,
    submittedDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  libraryBooks: [{
    bookTitle: {
      type: String,
      required: true
    },
    author: String,
    isbn: String,
    borrowedDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      required: true
    },
    returnedDate: Date,
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed'
    },
    fine: {
      type: Number,
      default: 0
    }
  }],
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
