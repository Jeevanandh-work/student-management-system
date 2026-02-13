# 🎓 Student Management System (Full-Stack Web Application)

A comprehensive, fully-functional Student Management System built with modern web technologies. This application demonstrates mastery in front-end and back-end development with secure authentication, CRUD operations, responsive design, and innovative features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Development](#frontend-development)
- [Backend Development](#backend-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

The Student Management System (SMS) is a full-stack web application designed to streamline the management of student records in educational institutions. It provides separate interfaces for administrators and students with role-based access control.

### Goals

- **Efficiency**: Simplify student record management with intuitive interfaces
- **Security**: Implement robust authentication and authorization
- **Scalability**: Design a system that can handle growing data
- **User Experience**: Provide responsive, modern UI with smooth interactions
- **Innovation**: Incorporate cutting-edge features like dark mode, real-time search, and analytics

---

## 🛠 Technologies Used

### Frontend
- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **Bootstrap 5**: Responsive mobile-first design framework
- **JavaScript (ES6+)**: Modern JavaScript features
- **jQuery**: AJAX requests and DOM manipulation
- **Chart.js**: Data visualization for analytics

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, minimalist web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling

### Security & Authentication
- **bcryptjs**: Password hashing
- **jsonwebtoken (JWT)**: Secure token-based authentication
- **CORS**: Cross-Origin Resource Sharing middleware

### File Handling
- **Multer**: Middleware for handling file uploads (student photos/documents)

### Development Tools
- **Nodemon**: Auto-restart during development
- **dotenv**: Environment variable management

---

## 🏗 System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  HTML5/CSS3  │  │  Bootstrap 5 │  │jQuery/AJAX   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▲  │
                         HTTPS │ REST API
                            │  ▼
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Express.js Server                    │       │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │       │
│  │  │Auth Routes │  │Student API │  │Middleware  │ │       │
│  │  └────────────┘  └────────────┘  └────────────┘ │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │  ▲
                         Mongoose
                            ▼  │
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌──────────────────────────────────────────────────┐       │
│  │              MongoDB Database                     │       │
│  │  ┌────────────┐  ┌────────────┐                 │       │
│  │  │   Users    │  │  Students  │                 │       │
│  │  └────────────┘  └────────────┘                 │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication**: Client sends credentials → Server validates → JWT token returned
2. **Data Operations**: Client sends request with JWT → Middleware validates token → Controller processes → Database query → Response
3. **Real-time Updates**: AJAX calls enable seamless data refresh without page reloads

### Database Schema

#### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'student']),
  studentId: ObjectId (ref: 'Student'),
  createdAt: Date
}
```

#### Student Model
```javascript
{
  rollNumber: String (unique, required),
  name: String (required),
  email: String (unique, required),
  phone: String,
  department: String (required),
  year: Number (1-4, required),
  semester: Number (1-8),
  dateOfBirth: Date,
  address: String,
  photo: String (file path),
  grades: [{
    subject: String,
    marks: Number,
    grade: String,
    semester: Number
  }],
  attendance: Number (0-100),
  status: String (enum: ['active', 'inactive', 'graduated']),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ Features

### Core Features

#### For Administrators
- ✅ **Secure Login**: JWT-based authentication
- ✅ **Dashboard Analytics**: View statistics (total students, active students, pass rate)
- ✅ **Student Management**: Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Advanced Search**: Real-time search by name, email, or roll number
- ✅ **Multi-Filter**: Filter by department, year, and status
- ✅ **Detailed View**: View complete student profiles with grades
- ✅ **Bulk Operations**: Manage multiple student records efficiently

#### For Students
- ✅ **Personal Dashboard**: View academic and personal information
- ✅ **Profile Management**: Update contact details and address
- ✅ **Grade Viewing**: Access academic performance records
- ✅ **Attendance Tracking**: Monitor attendance percentage

### Innovative Features

- 🌓 **Dark/Light Mode Toggle**: Theme persistence with localStorage
- 🔍 **Real-time Search**: Debounced search with instant results
- 📊 **Analytics Dashboard**: Visual statistics display
- 🎨 **Smooth Animations**: CSS transitions and fade-in effects
- 📱 **Responsive Design**: Mobile-first approach works on all devices
- 🔔 **Toast Notifications**: User-friendly alerts for actions
- 🖼 **Photo Upload**: Support for student photos/documents
- ⚡ **AJAX Operations**: No page refresh for seamless experience
- 🎯 **Form Validation**: Client and server-side validation
- 🔐 **Secure Authentication**: Password hashing and JWT tokens

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```powershell
git clone <repository-url>
cd student_managment_sustem
```

### Step 2: Install Dependencies

```powershell
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- multer
- dotenv
- nodemon (dev dependency)

### Step 3: Environment Configuration

The `.env` file has been created with default values. **Important**: Change these values for production!

```env
MONGO_URI=mongodb://localhost:27017/sms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_SECRET=create_admin_with_this_secret
PORT=5000
```

### Step 4: Start MongoDB

**Windows (PowerShell):**
```powershell
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath C:\data\db
```

**Mac/Linux:**
```bash
# Using Homebrew (Mac)
brew services start mongodb-community

# Or run mongod directly
mongod --dbpath /usr/local/var/mongodb
```

### Step 5: Create Admin Account

Use the API endpoint to create your first admin account:

```powershell
# Using curl (if available)
curl -X POST http://localhost:5000/api/auth/create-admin `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@sms.com\",\"password\":\"admin123\",\"secret\":\"create_admin_with_this_secret\"}'

# Or use Postman/Thunder Client with:
# POST http://localhost:5000/api/auth/create-admin
# Body: {
#   "email": "admin@sms.com",
#   "password": "admin123",
#   "secret": "create_admin_with_this_secret"
# }
```

### Step 6: Start the Application

**Development Mode (with auto-restart):**
```powershell
npm run dev
```

**Production Mode:**
```powershell
npm start
```

### Step 7: Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

**Default Login Credentials:**
- **Admin**: admin@sms.com / admin123
- **Student**: Register a new student account

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register Student
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "name": "John Doe",
  "rollNumber": "CS2021001",
  "department": "Computer Science",
  "year": 2,
  "phone": "1234567890"
}

Response: {
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "email": "...", "role": "student" }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@sms.com",
  "password": "admin123"
}

Response: {
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "email": "...", "role": "admin" }
}
```

#### Create Admin
```http
POST /auth/create-admin
Content-Type: application/json

{
  "email": "admin@sms.com",
  "password": "admin123",
  "secret": "create_admin_with_this_secret"
}
```

### Student Endpoints

All student endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Students (with filters)
```http
GET /students?search=john&department=Computer Science&year=2&status=active
```

#### Get Single Student
```http
GET /students/:id
```

#### Create Student (Admin only)
```http
POST /students
Content-Type: application/json

{
  "rollNumber": "CS2021002",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "department": "Computer Science",
  "year": 1,
  "phone": "9876543210",
  "address": "123 Main St",
  "attendance": 85,
  "status": "active"
}
```

#### Update Student
```http
PUT /students/:id
Content-Type: application/json

{
  "phone": "9999999999",
  "address": "New Address",
  "attendance": 90
}
```

#### Delete Student (Admin only)
```http
DELETE /students/:id
```

#### Upload Student Photo
```http
POST /students/:id/photo
Content-Type: multipart/form-data

photo: <file>
```

#### Get Statistics (Admin only)
```http
GET /students/stats/overview

Response: {
  "totalStudents": 150,
  "activeStudents": 145,
  "departments": 5,
  "passPercentage": "87.50"
}
```

---

## 🎨 Frontend Development

### HTML Structure

The application uses semantic HTML5 with Bootstrap 5 components:

- **Single Page Application (SPA)**: Dynamic content rendering in `#appContainer`
- **Responsive Navigation**: Bootstrap navbar with user info and dark mode toggle
- **Modal Dialogs**: Bootstrap modals for forms (Add/Edit student)
- **Card Components**: Bootstrap cards for dashboard statistics and student profiles
- **Tables**: Responsive Bootstrap tables for student listings

### CSS Design

**Key Design Principles:**
- Mobile-first responsive design
- CSS custom properties for theming
- Smooth transitions and animations
- Consistent spacing and typography
- Accessibility considerations

**Animation Examples:**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in { animation: fadeIn 0.5s ease-in; }
```

**Dark Mode Implementation:**
```css
body.dark-mode {
  background-color: #1a1a1a;
  color: #f8f9fa;
}
```

### JavaScript/jQuery Components

**State Management:**
```javascript
const AppState = {
  user: null,
  token: null,
  students: [],
  currentView: 'login'
};
```

**AJAX Example:**
```javascript
$.ajax({
  url: `${API_URL}/api/students`,
  method: 'GET',
  headers: { 'Authorization': `Bearer ${AppState.token}` },
  success: function(students) {
    renderStudentsTable(students);
  }
});
```

**Event Delegation:**
```javascript
$(document).on('click', '.edit-student-btn', handleEditStudent);
```

---

## ⚙️ Backend Development

### Express.js Server Structure

```
server.js              # Main entry point
├── middleware/
│   └── auth.js       # Authentication middleware
├── models/
│   ├── User.js       # User schema
│   └── Student.js    # Student schema
└── routes/
    ├── auth.js       # Authentication routes
    └── students.js   # Student CRUD routes
```

### MongoDB Connection

```javascript
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));
```

### Authentication Flow

1. **Registration**: Password hashed with bcrypt → User and Student records created
2. **Login**: Password compared → JWT token generated and returned
3. **Protected Routes**: Middleware validates JWT → Request processed

### Password Hashing

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### JWT Token Generation

```javascript
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
```

### Error Handling

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration with valid data
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Token persistence across sessions
- [ ] Logout functionality

#### Admin Dashboard
- [ ] View statistics
- [ ] Add new student
- [ ] Edit student details
- [ ] Delete student
- [ ] Search functionality
- [ ] Filter by department/year/status

#### Student Dashboard
- [ ] View personal profile
- [ ] Edit contact information
- [ ] View grades and attendance

#### UI/UX
- [ ] Responsive design on mobile
- [ ] Dark mode toggle
- [ ] Form validation
- [ ] Alert notifications
- [ ] Loading states

### API Testing with curl

```powershell
# Test login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@sms.com\",\"password\":\"admin123\"}'

# Test get students (replace TOKEN)
curl -X GET http://localhost:5000/api/students `
  -H "Authorization: Bearer TOKEN"
```

---

## 🌐 Deployment

### Deployment Options

#### Option 1: Render.com (Recommended)

1. **Prepare for Deployment:**
   - Ensure `.gitignore` includes `node_modules/` and `.env`
   - Push code to GitHub

2. **Create Web Service on Render:**
   - Connect your GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from `.env`

3. **MongoDB Atlas:**
   - Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string
   - Update `MONGO_URI` in Render environment variables

#### Option 2: Heroku

```powershell
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set ADMIN_SECRET=your_admin_secret

# Deploy
git push heroku main

# Open app
heroku open
```

#### Option 3: VPS (DigitalOcean, AWS, etc.)

```bash
# Install Node.js and MongoDB on server
# Clone repository
git clone <your-repo>
cd student_managment_sustem

# Install dependencies
npm install

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start server.js --name sms

# Setup nginx as reverse proxy
# Configure SSL with Let's Encrypt
```

### Environment Variables for Production

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sms_db
JWT_SECRET=very_long_random_string_generate_this_securely
ADMIN_SECRET=another_secure_random_string
PORT=5000
NODE_ENV=production
```

---

## 📸 Screenshots

### Login Page
- Modern authentication interface with tabs for Login/Register
- Gradient background with smooth animations
- Form validation and error handling

### Admin Dashboard
- Statistics cards showing key metrics
- Search and filter controls
- Responsive data table with action buttons
- Add/Edit student modals

### Student Dashboard
- Personal profile card with photo
- Academic performance display
- Editable contact information
- Attendance and status indicators

---

## 🔮 Future Enhancements

### Planned Features

1. **Real-time Notifications**
   - Socket.IO integration for instant updates
   - Push notifications for grade updates
   - Admin broadcast messages

2. **Advanced Analytics**
   - Chart.js/D3.js visualizations
   - Performance trends over time
   - Department-wise comparisons
   - Predictive analytics for student performance

3. **Progressive Web App (PWA)**
   - Offline functionality
   - Install as native app
   - Push notifications
   - Background sync

4. **AI-Powered Features**
   - Chatbot for student queries
   - Automated grade analysis
   - Performance predictions
   - Smart recommendations

5. **Enhanced File Management**
   - Document uploads (assignments, certificates)
   - Cloud storage integration
   - File preview
   - Version control

6. **Communication Module**
   - In-app messaging
   - Email integration
   - SMS notifications
   - Announcement system

7. **Attendance Management**
   - QR code check-in
   - Face recognition
   - Automated reports
   - Absence notifications

8. **Export & Reporting**
   - PDF report generation
   - Excel export
   - Custom report builder
   - Printable student cards

9. **Multi-language Support**
   - i18n implementation
   - RTL language support
   - Dynamic language switching

10. **Role Expansion**
    - Teacher role with grading permissions
    - Parent portal access
    - Department head dashboard
    - Fine-grained permissions

---

## 📝 Conclusion

This Student Management System demonstrates a complete understanding of modern full-stack web development. It combines:

- **Robust Backend**: RESTful API with Express.js and MongoDB
- **Interactive Frontend**: Responsive Bootstrap UI with jQuery
- **Security**: JWT authentication and password hashing
- **User Experience**: Smooth animations, dark mode, real-time search
- **Scalability**: Modular architecture ready for growth

The system is production-ready and can be extended with additional features as needed.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Bootstrap team for the excellent UI framework
- MongoDB team for the flexible database
- Express.js community
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Submit a pull request
- Contact via email

---

**Built with ❤️ using Node.js, Express, MongoDB, and Bootstrap**
