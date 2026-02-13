# 🚀 Quick Start Guide

Get the Student Management System running in 5 minutes!

## Prerequisites Check

Make sure you have these installed:
- ✅ Node.js (v14+): Run `node --version`
- ✅ MongoDB (v4.4+): Run `mongod --version`
- ✅ npm: Run `npm --version`

---

## Setup Steps

### 1️⃣ Install Dependencies (Already Done!)

```powershell
npm install
```

✅ Dependencies installed successfully!

### 2️⃣ Start MongoDB

**Option A - MongoDB Service (Recommended):**
```powershell
net start MongoDB
```

**Option B - Run MongoDB Manually:**
```powershell
mongod --dbpath C:\data\db
```

> **Note:** Create the data directory if it doesn't exist:
> ```powershell
> mkdir C:\data\db
> ```

### 3️⃣ Configure Environment (Already Done!)

The `.env` file is already configured with defaults:
```
MONGO_URI=mongodb://localhost:27017/sms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_SECRET=create_admin_with_this_secret
PORT=5000
```

### 4️⃣ Start the Application

**Development Mode (with auto-restart):**
```powershell
npm run dev
```

**Production Mode:**
```powershell
npm start
```

### 5️⃣ Create Admin Account

Open a new PowerShell window and run:

```powershell
# Method 1: Using Invoke-WebRequest (PowerShell)
$body = @{
    email = "admin@sms.com"
    password = "admin123"
    secret = "create_admin_with_this_secret"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5000/api/auth/create-admin `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Or use Postman/Thunder Client:**
- **URL:** `POST http://localhost:5000/api/auth/create-admin`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "email": "admin@sms.com",
  "password": "admin123",
  "secret": "create_admin_with_this_secret"
}
```

### 6️⃣ Access the Application

Open your browser and go to:
```
http://localhost:5000
```

---

## 🎯 Login Credentials

After creating the admin account:

**Admin Login:**
- Email: `admin@sms.com`
- Password: `admin123`

**Student Login:**
- Register a new student account via the "Register" tab
- Or create through admin panel after logging in

---

## 🎨 Features to Try

### As Admin:
1. ✅ View dashboard statistics
2. ✅ Add a new student (click "Add Student" button)
3. ✅ Search for students by name/email/roll number
4. ✅ Filter students by department, year, or status
5. ✅ Edit student information
6. ✅ View detailed student profile
7. ✅ Toggle dark mode
8. ✅ Delete student records

### As Student:
1. ✅ Register a new account
2. ✅ View personal profile
3. ✅ Edit contact information (phone, address)
4. ✅ View grades and attendance
5. ✅ Toggle dark mode

---

## 🛠 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoDB Connection Error: MongoServerError`

**Solution:**
1. Make sure MongoDB is running:
   ```powershell
   net start MongoDB
   ```
2. Check if port 27017 is available
3. Verify MONGO_URI in `.env` file

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change PORT in .env file
```

### Cannot Create Admin

**Error:** `Invalid admin secret`

**Solution:**
- Make sure the `secret` in your request matches `ADMIN_SECRET` in `.env`
- Default is: `create_admin_with_this_secret`

### Dependencies Installation Failed

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

---

## 📁 Project Structure

```
student_managment_sustem/
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User schema (admin/student)
│   └── Student.js           # Student data schema
├── routes/
│   ├── auth.js              # Login, register, create admin
│   └── students.js          # CRUD operations for students
├── public/
│   ├── css/
│   │   └── style.css        # Custom styles
│   ├── js/
│   │   └── app.js           # Frontend JavaScript/jQuery
│   └── index.html           # Main HTML file
├── uploads/                 # Student photos/documents
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
├── server.js               # Express server entry point
└── README.md               # Full documentation
```

---

## 🔧 Development Commands

```powershell
# Start in development mode (auto-restart on changes)
npm run dev

# Start in production mode
npm start

# Check for errors
node server.js
```

---

## 📚 Next Steps

1. **Read the full README.md** for detailed documentation
2. **Explore the API** using the API documentation section
3. **Customize the application** to fit your needs
4. **Add sample data** through the admin panel
5. **Test all features** including search, filter, and dark mode

---

## 🎉 You're Ready!

Your Student Management System is now running. Enjoy exploring all the features!

For detailed information, deployment guides, and API documentation, see **README.md**.

---

## 💡 Tips

- Use **Ctrl+C** to stop the server
- Check console for server logs and errors
- MongoDB must be running before starting the app
- Use **dark mode** for a better experience at night 🌙
- Test with different screen sizes to see responsive design

---

**Happy Coding! 🚀**
