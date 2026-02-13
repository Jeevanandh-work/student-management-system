# 📷 Profile Photo Upload Feature

## Overview
Students and admins can now upload profile pictures for student accounts. Photos are automatically displayed throughout the application.

---

## 🎯 Features Added

### 1. **Student Profile - Upload Button**
- Click the camera icon button overlaid on the profile photo
- Select an image file (JPG, PNG, GIF, etc.)
- Photo is instantly previewed and uploaded
- Maximum file size: 5MB

### 2. **Admin - Add Student with Photo**
- When adding a new student, admin can select a profile photo
- Photo field is optional
- If provided, photo is uploaded automatically after student creation

### 3. **Admin - Edit Student with Photo**
- Edit student modal shows current photo (if exists)
- Admin can select a new photo to replace the old one
- Leave file input empty to keep existing photo

### 4. **Student List View**
- Profile photos now display next to roll numbers
- Shows circular avatar with first initial if no photo uploaded
- Photos are 40x40px thumbnails

### 5. **Student Details Modal**
- Large 150x150px photo displayed in Personal Info tab
- Professional rounded corners with colored border

---

## 🧪 How to Use

### As a Student:
1. **Login** to your account
2. Navigate to **Profile** tab
3. Click the **camera icon** button on your profile photo
4. **Select an image** from your computer
5. Photo will be **automatically uploaded** and displayed

### As an Admin:

#### When Adding a Student:
1. Click **"Add Student"** button
2. Fill in all required details
3. Scroll down to **"Profile Photo"** field
4. Click **"Choose File"** and select an image
5. Click **"Add Student"**
6. ✅ Student is created with the photo

#### When Editing a Student:
1. Click **"Edit"** on any student
2. Current photo is displayed (if exists)
3. To **change photo**: Click "Choose File" and select new image
4. To **keep current photo**: Leave the file input empty
5. Click **"Update Student"**
6. ✅ Student is updated with new photo (if selected)

---

## 📁 Technical Details

### Backend API Endpoint
```
POST /api/students/:id/photo
```

**Headers:**
- Authorization: Bearer {JWT_TOKEN}

**Body (multipart/form-data):**
- photo: Image file

**Response:**
```json
{
  "message": "Photo uploaded successfully",
  "photoPath": "uploads/1635678901234-photo.jpg"
}
```

### File Storage
- Photos are stored in: `uploads/` directory
- Filename format: `{timestamp}-{originalname}`
- Served as static files at: `/uploads/{filename}`

### File Validation
- **Accepted formats**: All image types (image/*)
- **Max file size**: 5MB
- **Client-side validation**: File type and size checked before upload
- **Server-side validation**: Multer handles file type filtering

---

## 🎨 Photo Display Locations

### 1. Student Profile Page
```html
<div class="profile-photo-container">
  <img src="/uploads/photo.jpg" class="profile-photo">
  <button class="upload-photo-btn">
    <i class="bi bi-camera"></i>
  </button>
</div>
```

### 2. Admin Students List
```html
<td>
  <img src="/uploads/photo.jpg" style="width: 40px; height: 40px; border-radius: 50%;">
  <span>ROLL001</span>
</td>
```

### 3. Student Details Modal
```html
<img src="/uploads/photo.jpg" style="width: 150px; height: 150px; border-radius: 15px;">
```

### 4. Default Avatar (No Photo)
Uses SVG data URI with gradient background and student's first initial:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
  <rect fill="#667eea" width="150" height="150" rx="20"/>
  <text fill="#ffffff" font-size="60" x="50%" y="50%">J</text>
</svg>
```

---

## 🔒 Security Features

### 1. Authentication Required
- All photo upload requests require valid JWT token
- Students can only upload to their own profile
- Admins can upload for any student

### 2. Permission Checks
```javascript
// Students can only update their own photo
if (req.user.role !== 'admin' && 
    student._id.toString() !== req.user.studentId?.toString()) {
  return res.status(403).json({ message: 'Access denied' });
}
```

### 3. File Type Filtering
```javascript
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});
```

---

## 🎯 CSS Styling

### Upload Button
```css
.upload-photo-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
}

.upload-photo-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

### Profile Photo Container
```css
.profile-photo-container {
  display: inline-block;
  position: relative;
  margin-bottom: 15px;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  object-fit: cover;
}
```

---

## 📊 User Flow Diagram

```
Student Profile Page
       |
       v
   [Click Camera Icon]
       |
       v
   [File Picker Opens]
       |
       v
   [Select Image]
       |
       v
[Client-side Validation]
       |
       +-- Invalid --> Show Error
       |
       +-- Valid
           |
           v
    [Show Preview]
           |
           v
    [Upload to Server]
           |
           v
    POST /api/students/:id/photo
           |
           v
    [Multer Processing]
           |
           v
    [Save to uploads/]
           |
           v
    [Update DB with path]
           |
           v
    [Return Success]
           |
           v
    [Update UI]
```

---

## ⚙️ Configuration

### Multer Storage Configuration
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
```

### Express Static Middleware
```javascript
app.use('/uploads', express.static('uploads'));
```

---

## 🐛 Error Handling

### Client-Side Errors
1. **File too large**: "Image size should be less than 5MB"
2. **Invalid file type**: "Please select an image file"
3. **Upload failed**: "Failed to upload photo"

### Server-Side Errors
1. **No file uploaded**: Returns 400 error
2. **Student not found**: Returns 404 error
3. **Permission denied**: Returns 403 error
4. **File save error**: Returns 500 error

---

## 🔄 Image Preview Feature

### Instant Preview
```javascript
const reader = new FileReader();
reader.onload = function(e) {
  $('#profilePhotoPreview').attr('src', e.target.result);
};
reader.readAsDataURL(file);
```

### Loading State
```javascript
uploadBtn.html('<i class="bi bi-hourglass-split"></i>')
         .prop('disabled', true);
```

---

## 📝 Future Enhancements

Potential improvements:
1. **Image Cropping**: Allow users to crop photos before upload
2. **Compression**: Automatically compress large images
3. **Multiple Formats**: Support WebP for better performance
4. **CDN Integration**: Store photos on cloud storage (AWS S3, Cloudinary)
5. **Image Rotation**: Detect and fix image orientation
6. **Thumbnails**: Generate multiple sizes for different views
7. **Profile Gallery**: Allow multiple photos per student
8. **Photo Verification**: Admin approval for uploaded photos

---

## ✅ Testing Checklist

- [ ] Student can upload photo from profile page
- [ ] Photo appears immediately after upload
- [ ] Admin can add student with photo
- [ ] Admin can edit student photo
- [ ] Large files (>5MB) are rejected
- [ ] Non-image files are rejected
- [ ] Photos display in student list
- [ ] Photos display in details modal
- [ ] Default avatar shows when no photo
- [ ] Loading state appears during upload
- [ ] Error messages display correctly
- [ ] Uploaded files are saved in uploads/ folder
- [ ] Photos are accessible via /uploads/ URL

---

**Developed with ❤️ for Student Management System**
