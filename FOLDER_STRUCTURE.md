# 📁 Project Folder Structure

## New Organization (October 30, 2025)

The project has been reorganized into `frontend` and `backend` folders for better code organization and maintainability.

```
student_managment_sustem/
│
├── 📂 backend/                    # Backend (Node.js + Express + MongoDB)
│   ├── server.js                  # Main Express server
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Environment variables
│   │
│   ├── 📂 models/                # Mongoose schemas
│   │   ├── User.js               # User model (auth)
│   │   └── Student.js            # Student model
│   │
│   ├── 📂 routes/                # API routes
│   │   ├── auth.js               # Authentication endpoints
│   │   └── students.js           # Student CRUD & management
│   │
│   ├── 📂 middleware/            # Express middleware
│   │   └── auth.js               # JWT authentication
│   │
│   └── 📂 uploads/               # User-uploaded files (profile photos)
│
├── 📂 frontend/                   # Frontend (HTML + CSS + JavaScript)
│   └── 📂 public/                # Static files
│       ├── index.html            # Main HTML file
│       ├── 📂 css/
│       │   └── style.css         # All styles (392 lines)
│       └── 📂 js/
│           └── app.js            # Frontend logic (2,100+ lines)
│
├── 📂 node_modules/              # Installed packages
│
├── 📄 package.json               # Root package.json (run backend)
├── 📄 package-lock.json          # Dependency lock file
├── 📄 .env                       # Environment variables (root copy)
├── 📄 .gitignore                 # Git ignore rules
│
└── 📂 Documentation/             # Project documentation
    ├── README.md                 # Comprehensive guide (7,000+ words)
    ├── QUICKSTART.md            # Quick setup guide
    ├── PROJECT_SUMMARY.md       # Technical summary
    ├── PROJECT_REVIEW.md        # Detailed project review
    ├── ADMIN_FEATURES.md        # Admin feature guide
    ├── PHOTO_UPLOAD_GUIDE.md    # Photo upload documentation
    ├── PHOTO_FEATURE_COMPLETE.md # Feature completion notes
    └── FOLDER_STRUCTURE.md      # This file
```

## 🚀 How to Run

### Option 1: Run from Root Directory
```bash
cd student_managment_sustem
npm start
```
The root `package.json` is configured to run the backend server from the `backend/` folder.

### Option 2: Run from Backend Directory
```bash
cd student_managment_sustem/backend
npm start
```

### Development Mode (with auto-restart)
```bash
cd student_managment_sustem/backend
npm run dev
```

## 📍 Access Points

- **Frontend:** http://localhost:5000
- **Backend API:** http://localhost:5000/api
- **Uploaded Files:** http://localhost:5000/uploads

## 🔧 Backend Structure

### server.js
- Express server configuration
- MongoDB connection
- Middleware setup
- Route mounting
- Static file serving (serves frontend from `../frontend/public`)

### models/
- **User.js:** Authentication model with bcrypt password hashing
- **Student.js:** Student data with subdocuments (projects, library, grades)

### routes/
- **auth.js:** Login, register, create-admin endpoints
- **students.js:** 30+ endpoints for student management

### middleware/
- **auth.js:** JWT verification and role-based access control

### uploads/
- Profile photos uploaded by students/admin
- Served via `/uploads` route

## 🎨 Frontend Structure

### public/
- **index.html:** Single-page application (SPA) structure
- **css/style.css:** Dark mode, animations, responsive design
- **js/app.js:** Complete frontend logic with jQuery

## 🔄 Path Updates Made

The following paths were updated in `backend/server.js`:

```javascript
// Static files now point to frontend folder
app.use(express.static(path.join(__dirname, '../frontend/public')));

// HTML file served from frontend folder
res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));

// Uploads folder (stays in backend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

## 📦 Dependencies

All dependencies remain in the `backend/` folder as this is a backend-heavy application with a static frontend.

### Backend Dependencies:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- multer
- cors
- dotenv

### Frontend Dependencies (CDN):
- Bootstrap 5
- jQuery 3.6.0
- Bootstrap Icons
- Chart.js

## 🌟 Benefits of New Structure

1. **Separation of Concerns:** Clear distinction between frontend and backend code
2. **Scalability:** Easier to scale frontend and backend independently
3. **Maintainability:** Better organization makes code easier to navigate
4. **Future-Proof:** Ready for microservices architecture if needed
5. **Team Collaboration:** Frontend and backend teams can work independently

## 🔜 Future Enhancements

### Potential Structure Improvements:

1. **Separate Frontend Project:**
   ```
   frontend/
   ├── package.json          # Frontend dependencies
   ├── webpack.config.js     # Build configuration
   ├── src/
   │   ├── components/       # React/Vue components
   │   ├── services/         # API service layer
   │   └── styles/           # CSS modules
   ```

2. **Backend Microservices:**
   ```
   backend/
   ├── auth-service/
   ├── student-service/
   ├── grade-service/
   └── library-service/
   ```

3. **Shared Types (TypeScript):**
   ```
   shared/
   └── types/
       ├── User.ts
       └── Student.ts
   ```

## 📝 Notes

- The root `package.json` and `.env` are kept for convenience
- Backend has its own `package.json` and `.env` copy
- All backend code is now in `backend/` folder
- All frontend code is now in `frontend/public/` folder
- Server runs from backend and serves frontend automatically

---

**Updated:** October 30, 2025  
**Status:** ✅ Reorganization Complete
