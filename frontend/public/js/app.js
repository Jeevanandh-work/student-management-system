// Global State
const AppState = {
    user: null,
    token: null,
    students: [],
    currentView: 'login'
};

// API Base URL
const API_URL = window.location.origin;

// Initialize App
$(document).ready(function() {
    initializeApp();
});

function initializeApp() {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('body').addClass('dark-mode');
        $('#darkModeToggle i').removeClass('bi-moon-fill').addClass('bi-sun-fill');
    }

    // Check for saved token
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
        AppState.token = savedToken;
        AppState.user = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLoginPage();
    }

    // Event Listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Dark mode toggle
    $(document).on('click', '#darkModeToggle', toggleDarkMode);
    
    // Logout
    $(document).on('click', '#logoutBtn', logout);
    
    // Auth form submissions
    $(document).on('submit', '#loginForm', handleLogin);
    $(document).on('submit', '#registerForm', handleRegister);
    
    // Student operations
    $(document).on('click', '#addStudentBtn', showAddStudentModal);
    $(document).on('submit', '#addStudentForm', handleAddStudent);
    $(document).on('click', '.delete-student-btn', handleDeleteStudent);
    $(document).on('click', '.view-student-btn', handleViewStudent);
    
    // Search and filter
    $(document).on('input', '#searchInput', debounce(handleSearch, 300));
    $(document).on('change', '#departmentFilter, #yearFilter, #statusFilter', handleFilter);
    $(document).on('click', '#clearFiltersBtn', clearFilters);
    
    // Student profile edit
    $(document).on('click', '#editProfileBtn', enableProfileEdit);
    $(document).on('submit', '#editProfileForm', handleProfileUpdate);
    
    // Projects
    $(document).on('click', '#addProjectBtn', showAddProjectModal);
    $(document).on('submit', '#addProjectForm', handleAddProject);
    $(document).on('click', '.edit-project-btn', handleEditProject);
    $(document).on('click', '.delete-project-btn', handleDeleteProject);
    
    // Library
    $(document).on('click', '#borrowBookBtn', showBorrowBookModal);
    $(document).on('submit', '#borrowBookForm', handleBorrowBook);
    $(document).on('click', '.return-book-btn', handleReturnBook);
    
    // Admin grade management
    $(document).on('click', '.add-grade-btn', showAddGradeModal);
    $(document).on('submit', '#addGradeForm', handleAddGrade);
    $(document).on('click', '.edit-grade-btn', showEditGradeModal);
    $(document).on('submit', '#editGradeForm', handleEditGrade);
    $(document).on('click', '.delete-grade-btn', handleDeleteGrade);
    $(document).on('click', '.grade-project-btn', showGradeProjectModal);
    $(document).on('submit', '#gradeProjectForm', handleGradeProject);
    
    // Admin attendance and status management
    $(document).on('click', '.edit-attendance-btn', showEditAttendanceModal);
    $(document).on('submit', '#editAttendanceForm', handleEditAttendance);
    $(document).on('click', '.edit-status-btn', showEditStatusModal);
    $(document).on('submit', '#editStatusForm', handleEditStatus);
}

// ============= Authentication =============

function showLoginPage() {
    $('#mainNav').hide();
    $('#appContainer').html(`
        <div class="auth-container fade-in">
            <div class="card auth-card">
                <div class="card-header">
                    <h3><i class="bi bi-mortarboard-fill"></i> Student Management System</h3>
                    <p class="mb-0">Welcome Back!</p>
                </div>
                <div class="card-body">
                    <ul class="nav nav-pills nav-justified mb-4" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="pill" href="#loginTab">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="pill" href="#registerTab">Register</a>
                        </li>
                    </ul>
                    
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="loginTab">
                            <form id="loginForm">
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" name="email" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" name="password" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="bi bi-box-arrow-in-right"></i> Login
                                </button>
                            </form>
                            <div class="mt-3 text-center">
                                <small class="text-muted">
                                    Demo Admin: admin@sms.com / admin123<br>
                                    Demo Student: student@test.com / student123
                                </small>
                            </div>
                        </div>
                        
                        <div class="tab-pane fade" id="registerTab">
                            <form id="registerForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" class="form-control" name="name" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Roll Number</label>
                                        <input type="text" class="form-control" name="rollNumber" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" name="email" required>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Department</label>
                                        <select class="form-select" name="department" required>
                                            <option value="">Select Department</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Civil">Civil</option>
                                            <option value="Electrical">Electrical</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Year</label>
                                        <select class="form-select" name="year" required>
                                            <option value="">Select Year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="tel" class="form-control" name="phone">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" name="password" required minlength="6">
                                </div>
                                <button type="submit" class="btn btn-success w-100">
                                    <i class="bi bi-person-plus"></i> Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function handleLogin(e) {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => data[field.name] = field.value);

    $.ajax({
        url: `${API_URL}/api/auth/login`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            AppState.token = response.token;
            AppState.user = response.user;
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            showAlert('Login successful!', 'success');
            showDashboard();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Login failed', 'danger');
        }
    });
}

function handleRegister(e) {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => data[field.name] = field.value);

    $.ajax({
        url: `${API_URL}/api/auth/register`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            AppState.token = response.token;
            AppState.user = response.user;
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            showAlert('Registration successful!', 'success');
            showDashboard();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Registration failed', 'danger');
        }
    });
}

function logout() {
    AppState.token = null;
    AppState.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAlert('Logged out successfully', 'info');
    showLoginPage();
}

// ============= Dashboard =============

function showDashboard() {
    $('#mainNav').show();
    $('#userEmail').text(AppState.user.email);
    
    if (AppState.user.role === 'admin') {
        showAdminDashboard();
    } else {
        showStudentDashboard();
    }
}

function showAdminDashboard() {
    $('#appContainer').html(`
        <div class="dashboard-container fade-in">
            <div class="container-fluid">
                <h2 class="mb-4"><i class="bi bi-speedometer2"></i> Admin Dashboard</h2>
                
                <!-- Statistics Cards -->
                <div class="row mb-4" id="statsContainer">
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card bg-primary text-white">
                            <div class="card-body">
                                <i class="bi bi-people-fill stat-icon"></i>
                                <div class="stat-number" id="totalStudents">0</div>
                                <div class="stat-label">Total Students</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card bg-success text-white">
                            <div class="card-body">
                                <i class="bi bi-person-check-fill stat-icon"></i>
                                <div class="stat-number" id="activeStudents">0</div>
                                <div class="stat-label">Active Students</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card bg-info text-white">
                            <div class="card-body">
                                <i class="bi bi-building stat-icon"></i>
                                <div class="stat-number" id="totalDepartments">0</div>
                                <div class="stat-label">Departments</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card stat-card bg-warning text-white">
                            <div class="card-body">
                                <i class="bi bi-graph-up stat-icon"></i>
                                <div class="stat-number" id="passPercentage">0%</div>
                                <div class="stat-label">Pass Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter -->
                <div class="search-filter-container">
                    <div class="row align-items-end">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Search</label>
                            <input type="text" class="form-control search-input" id="searchInput" 
                                   placeholder="Search by name, email, or roll number...">
                        </div>
                        <div class="col-md-2 mb-3">
                            <label class="form-label">Department</label>
                            <select class="form-select" id="departmentFilter">
                                <option value="">All</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="Civil">Civil</option>
                                <option value="Electrical">Electrical</option>
                            </select>
                        </div>
                        <div class="col-md-2 mb-3">
                            <label class="form-label">Year</label>
                            <select class="form-select" id="yearFilter">
                                <option value="">All</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                        <div class="col-md-2 mb-3">
                            <label class="form-label">Status</label>
                            <select class="form-select" id="statusFilter">
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="graduated">Graduated</option>
                            </select>
                        </div>
                        <div class="col-md-2 mb-3">
                            <button class="btn btn-secondary w-100" id="clearFiltersBtn">
                                <i class="bi bi-x-circle"></i> Clear
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Students Table -->
                <div class="table-container">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4><i class="bi bi-table"></i> Student Records</h4>
                        <button class="btn btn-primary" id="addStudentBtn">
                            <i class="bi bi-plus-circle"></i> Add Student
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="studentsTableBody">
                                <tr><td colspan="7" class="text-center">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `);

    loadStatistics();
    loadStudents();
}

function showStudentDashboard() {
    $('#appContainer').html(`
        <div class="dashboard-container fade-in">
            <div class="container">
                <h2 class="mb-4"><i class="bi bi-person-circle"></i> My Profile</h2>
                <div id="profileContainer">
                    <div class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    loadStudentProfile();
}

// ============= Student Operations =============

function loadStudents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    
    $.ajax({
        url: `${API_URL}/api/students?${queryParams}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function(students) {
            AppState.students = students;
            renderStudentsTable(students);
        },
        error: function(xhr) {
            showAlert('Failed to load students', 'danger');
        }
    });
}

function renderStudentsTable(students) {
    if (students.length === 0) {
        $('#studentsTableBody').html('<tr><td colspan="7" class="text-center">No students found</td></tr>');
        return;
    }

    const rows = students.map(student => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${student.photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect fill="%23667eea" width="40" height="40" rx="20"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="18" text-anchor="middle" x="50%25" y="50%25" dy=".3em"%3E' + student.name.charAt(0).toUpperCase() + '%3C/text%3E%3C/svg%3E'}" 
                         alt="${student.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 10px;">
                    <span>${student.rollNumber}</span>
                </div>
            </td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.department}</td>
            <td>${student.year}</td>
            <td>
                <span class="badge bg-${getStatusColor(student.status)}">
                    ${student.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info action-btn view-student-btn" data-id="${student._id}">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-danger action-btn delete-student-btn" data-id="${student._id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    $('#studentsTableBody').html(rows);
}

function loadStatistics() {
    $.ajax({
        url: `${API_URL}/api/students/stats/overview`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function(stats) {
            $('#totalStudents').text(stats.totalStudents);
            $('#activeStudents').text(stats.activeStudents);
            $('#totalDepartments').text(stats.departments);
            $('#passPercentage').text(stats.passPercentage + '%');
        },
        error: function(xhr) {
            console.error('Failed to load statistics');
        }
    });
}

function loadStudentProfile() {
    $.ajax({
        url: `${API_URL}/api/students/${AppState.user.studentId}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function(student) {
            renderStudentProfile(student);
        },
        error: function(xhr) {
            showAlert('Failed to load profile', 'danger');
        }
    });
}

function renderStudentProfile(student) {
    const gradesHtml = student.grades && student.grades.length > 0 
        ? student.grades.map(g => `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h6>${g.subject}</h6>
                        <div class="d-flex justify-content-between">
                            <span>Marks: ${g.marks}</span>
                            <span class="badge bg-${getGradeColor(g.grade)}">${g.grade}</span>
                        </div>
                        ${g.credits ? `<small class="text-muted">Credits: ${g.credits}</small>` : ''}
                    </div>
                </div>
            </div>
        `).join('')
        : '<p class="text-muted">No grades recorded yet</p>';

    const projectsHtml = student.projects && student.projects.length > 0
        ? student.projects.map(p => `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h6>${p.title}</h6>
                        <p class="text-muted small">${p.description || 'No description'}</p>
                        <div class="mb-2">
                            ${p.technologies ? p.technologies.map(t => `<span class="badge bg-info">${t}</span>`).join(' ') : ''}
                        </div>
                        <span class="badge bg-${getProjectStatusColor(p.status)}">${p.status}</span>
                        ${p.grade ? `<span class="badge bg-success ms-2">Grade: ${p.grade}</span>` : ''}
                        <div class="mt-2">
                            ${p.githubLink ? `<a href="${p.githubLink}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="bi bi-github"></i></a>` : ''}
                            ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" class="btn btn-sm btn-outline-success ms-1"><i class="bi bi-link-45deg"></i></a>` : ''}
                            <button class="btn btn-sm btn-warning ms-1 edit-project-btn" data-project-id="${p._id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-danger ms-1 delete-project-btn" data-project-id="${p._id}"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')
        : '<p class="text-muted">No projects added yet</p>';

    const borrowedBooksHtml = student.libraryBooks && student.libraryBooks.filter(b => b.status !== 'returned').length > 0
        ? student.libraryBooks.filter(b => b.status !== 'returned').map(b => `
            <div class="col-md-12 mb-2">
                <div class="card">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${b.bookTitle}</h6>
                            <small class="text-muted">${b.author || 'Unknown Author'}</small>
                            ${b.isbn ? `<small class="text-muted"> | ISBN: ${b.isbn}</small>` : ''}
                        </div>
                        <div class="text-end">
                            <span class="badge bg-${getBookStatusColor(b.status)}">${b.status}</span>
                            <br><small class="text-muted">Due: ${new Date(b.dueDate).toLocaleDateString()}</small>
                            ${b.status !== 'returned' ? `<br><button class="btn btn-sm btn-success mt-1 return-book-btn" data-book-id="${b._id}">Return</button>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('')
        : '<p class="text-muted">No borrowed books</p>';

    $('#profileContainer').html(`
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-photo-container position-relative">
                    <img src="${student.photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"%3E%3Crect fill="%23667eea" width="150" height="150"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="60" text-anchor="middle" x="50%25" y="50%25" dy=".3em"%3E' + student.name.charAt(0).toUpperCase() + '%3C/text%3E%3C/svg%3E'}" 
                         alt="Profile Photo" class="profile-photo" id="profilePhotoPreview">
                    <button class="btn btn-sm btn-primary upload-photo-btn" onclick="$('#photoUploadInput').click()">
                        <i class="bi bi-camera"></i>
                    </button>
                    <input type="file" id="photoUploadInput" accept="image/*" style="display: none;" data-student-id="${student._id}">
                </div>
                <h3>${student.name}</h3>
                <p class="mb-0">${student.rollNumber}</p>
            </div>
            <div class="profile-body">
                <!-- Navigation Tabs -->
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#infoTab">Personal Info</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#gradesTab">Grades</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#projectsTab">Projects</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#libraryTab">Library</a>
                    </li>
                </ul>

                <div class="tab-content">
                    <!-- Personal Info Tab -->
                    <div class="tab-pane fade show active" id="infoTab">
                        <div class="d-flex justify-content-between mb-3">
                            <h5>Personal Information</h5>
                            <button class="btn btn-sm btn-primary" id="editProfileBtn">
                                <i class="bi bi-pencil"></i> Edit
                            </button>
                        </div>
                        <div id="profileInfo">
                            <div class="info-row">
                                <span class="info-label">Email:</span>
                                <span>${student.email}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Phone:</span>
                                <span>${student.phone || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Department:</span>
                                <span>${student.department}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Year:</span>
                                <span>${student.year}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Address:</span>
                                <span>${student.address || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Attendance:</span>
                                <span>${student.attendance}%</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Status:</span>
                                <span class="badge bg-${getStatusColor(student.status)}">${student.status}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Grades Tab -->
                    <div class="tab-pane fade" id="gradesTab">
                        <h5 class="mb-3">Academic Performance</h5>
                        <div class="row">
                            ${gradesHtml}
                        </div>
                    </div>

                    <!-- Projects Tab -->
                    <div class="tab-pane fade" id="projectsTab">
                        <div class="d-flex justify-content-between mb-3">
                            <h5>My Projects</h5>
                            <button class="btn btn-sm btn-primary" id="addProjectBtn">
                                <i class="bi bi-plus-circle"></i> Add Project
                            </button>
                        </div>
                        <div class="row" id="projectsList">
                            ${projectsHtml}
                        </div>
                    </div>

                    <!-- Library Tab -->
                    <div class="tab-pane fade" id="libraryTab">
                        <div class="d-flex justify-content-between mb-3">
                            <h5>Borrowed Books</h5>
                            <button class="btn btn-sm btn-primary" id="borrowBookBtn">
                                <i class="bi bi-book"></i> Borrow Book
                            </button>
                        </div>
                        <div class="row" id="booksList">
                            ${borrowedBooksHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

// ============= Modal Operations =============

function showAddStudentModal() {
    const modalHtml = `
        <div class="modal fade" id="addStudentModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-person-plus"></i> Add New Student</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addStudentForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Roll Number *</label>
                                    <input type="text" class="form-control" name="rollNumber" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Full Name *</label>
                                    <input type="text" class="form-control" name="name" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email *</label>
                                    <input type="email" class="form-control" name="email" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="tel" class="form-control" name="phone">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Department *</label>
                                    <select class="form-select" name="department" required>
                                        <option value="">Select Department</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                        <option value="Electrical">Electrical</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Year *</label>
                                    <select class="form-select" name="year" required>
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Address</label>
                                <textarea class="form-control" name="address" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Profile Photo</label>
                                <input type="file" class="form-control" id="addStudentPhoto" accept="image/*">
                                <small class="text-muted">Max size: 5MB</small>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Attendance (%)</label>
                                    <input type="number" class="form-control" name="attendance" min="0" max="100" value="0">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" name="status">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="graduated">Graduated</option>
                                    </select>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
    modal.show();

    $('#addStudentModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleAddStudent(e) {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => data[field.name] = field.value);

    // First, create the student
    $.ajax({
        url: `${API_URL}/api/students`,
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            const studentId = response.student._id;
            const photoFile = $('#addStudentPhoto')[0].files[0];
            
            // If photo is selected, upload it
            if (photoFile) {
                const photoFormData = new FormData();
                photoFormData.append('photo', photoFile);
                
                $.ajax({
                    url: `${API_URL}/api/students/${studentId}/photo`,
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${AppState.token}` },
                    data: photoFormData,
                    processData: false,
                    contentType: false,
                    success: function() {
                        showAlert('Student added successfully with photo!', 'success');
                        bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
                        loadStudents();
                        loadStatistics();
                    },
                    error: function() {
                        showAlert('Student added but photo upload failed', 'warning');
                        bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
                        loadStudents();
                        loadStatistics();
                    }
                });
            } else {
                showAlert('Student added successfully!', 'success');
                bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
                loadStudents();
                loadStatistics();
            }
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to add student', 'danger');
        }
    });
}

// Removed: Admin cannot edit student info
// function handleEditStudent(e) { ... }
// function handleUpdateStudent(e) { ... }

function handleDeleteStudent(e) {
    const studentId = $(e.currentTarget).data('id');
    
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    $.ajax({
        url: `${API_URL}/api/students/${studentId}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function() {
            showAlert('Student deleted successfully!', 'success');
            loadStudents();
            loadStatistics();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to delete student', 'danger');
        }
    });
}

function handleViewStudent(e) {
    const studentId = $(e.currentTarget).data('id');
    
    $.ajax({
        url: `${API_URL}/api/students/${studentId}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function(student) {
            showStudentDetailsModal(student);
        },
        error: function(xhr) {
            showAlert('Failed to load student details', 'danger');
        }
    });
}

function showStudentDetailsModal(student) {
    const gradesHtml = student.grades && student.grades.length > 0 
        ? student.grades.map(g => `
            <tr>
                <td>${g.subject}</td>
                <td>${g.marks}</td>
                <td><span class="badge bg-${getGradeColor(g.grade)}">${g.grade}</span></td>
                <td>${g.semester || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-grade-btn me-1" data-student-id="${student._id}" data-grade-id="${g._id}" 
                            data-subject="${g.subject}" data-marks="${g.marks}" data-grade="${g.grade}" 
                            data-semester="${g.semester || ''}" data-credits="${g.credits || ''}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-grade-btn" data-student-id="${student._id}" data-grade-id="${g._id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('')
        : '<tr><td colspan="5" class="text-center text-muted">No grades recorded</td></tr>';

    const projectsHtml = student.projects && student.projects.length > 0
        ? student.projects.map(p => `
            <div class="card mb-2">
                <div class="card-body">
                    <h6>${p.title} <span class="badge bg-${getProjectStatusColor(p.status)}">${p.status}</span></h6>
                    <p class="text-muted small mb-1">${p.description || 'No description'}</p>
                    ${p.technologies ? '<div class="mb-1">' + p.technologies.map(t => `<span class="badge bg-info">${t}</span>`).join(' ') + '</div>' : ''}
                    ${p.githubLink ? `<a href="${p.githubLink}" target="_blank" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-github"></i> GitHub</a>` : ''}
                    ${p.liveLink ? `<a href="${p.liveLink}" target="_blank" class="btn btn-sm btn-outline-success"><i class="bi bi-link-45deg"></i> Live Demo</a>` : ''}
                    ${p.grade ? `<span class="badge bg-success ms-2">Grade: ${p.grade}</span>` : `<button class="btn btn-sm btn-warning ms-2 grade-project-btn" data-student-id="${student._id}" data-project-id="${p._id}"><i class="bi bi-star"></i> Grade</button>`}
                </div>
            </div>
        `).join('')
        : '<p class="text-muted">No projects added</p>';

    const booksHtml = student.libraryBooks && student.libraryBooks.length > 0
        ? student.libraryBooks.map(b => `
            <tr>
                <td>${b.bookTitle}</td>
                <td>${b.author || 'Unknown'}</td>
                <td>${new Date(b.borrowedDate).toLocaleDateString()}</td>
                <td>${new Date(b.dueDate).toLocaleDateString()}</td>
                <td><span class="badge bg-${getBookStatusColor(b.status)}">${b.status}</span></td>
                <td>${b.fine > 0 ? '$' + b.fine : '-'}</td>
            </tr>
        `).join('')
        : '<tr><td colspan="6" class="text-center text-muted">No books borrowed</td></tr>';

    const modalHtml = `
        <div class="modal fade" id="viewStudentModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-person-circle"></i> Student Details - ${student.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Nav Tabs -->
                        <ul class="nav nav-tabs mb-3" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" data-bs-toggle="tab" href="#detailsInfoTab">Personal Info</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#detailsGradesTab">Grades</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#detailsProjectsTab">Projects</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-bs-toggle="tab" href="#detailsLibraryTab">Library Books</a>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <!-- Personal Info Tab -->
                            <div class="tab-pane fade show active" id="detailsInfoTab">
                                <div class="row">
                                    <div class="col-md-3 text-center mb-3">
                                        <img src="${student.photo || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"%3E%3Crect fill="%23667eea" width="150" height="150" rx="20"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="60" text-anchor="middle" x="50%25" y="50%25" dy=".3em"%3E' + student.name.charAt(0).toUpperCase() + '%3C/text%3E%3C/svg%3E'}" 
                                             alt="${student.name}" style="width: 150px; height: 150px; border-radius: 15px; object-fit: cover; border: 3px solid #667eea;">
                                    </div>
                                    <div class="col-md-9">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
                                                <p><strong>Name:</strong> ${student.name}</p>
                                                <p><strong>Email:</strong> ${student.email}</p>
                                                <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p><strong>Department:</strong> ${student.department}</p>
                                                <p><strong>Year:</strong> ${student.year}</p>
                                                <p><strong>Attendance:</strong> ${student.attendance}% 
                                                    <button class="btn btn-sm btn-warning ms-2 edit-attendance-btn" data-student-id="${student._id}" data-attendance="${student.attendance}">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                </p>
                                                <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(student.status)}">${student.status}</span>
                                                    <button class="btn btn-sm btn-warning ms-2 edit-status-btn" data-student-id="${student._id}" data-status="${student.status}">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                        ${student.address ? `<p><strong>Address:</strong> ${student.address}</p>` : ''}
                                    </div>
                                </div>
                            </div>

                            <!-- Grades Tab -->
                            <div class="tab-pane fade" id="detailsGradesTab">
                                <div class="d-flex justify-content-between mb-3">
                                    <h6>Academic Grades</h6>
                                    <button class="btn btn-sm btn-primary add-grade-btn" data-student-id="${student._id}">
                                        <i class="bi bi-plus-circle"></i> Add Grade
                                    </button>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Subject</th>
                                                <th>Marks</th>
                                                <th>Grade</th>
                                                <th>Semester</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${gradesHtml}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Projects Tab -->
                            <div class="tab-pane fade" id="detailsProjectsTab">
                                <h6 class="mb-3">Student Projects</h6>
                                ${projectsHtml}
                            </div>

                            <!-- Library Books Tab -->
                            <div class="tab-pane fade" id="detailsLibraryTab">
                                <h6 class="mb-3">Library Books</h6>
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Book Title</th>
                                                <th>Author</th>
                                                <th>Borrowed Date</th>
                                                <th>Due Date</th>
                                                <th>Status</th>
                                                <th>Fine</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${booksHtml}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('viewStudentModal'));
    modal.show();

    $('#viewStudentModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

// ============= Profile Edit (Student) =============

function enableProfileEdit() {
    // Fetch the current student data
    $.ajax({
        url: `${API_URL}/api/students/${AppState.user.studentId}`,
        method: 'GET',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function(studentData) {
            showProfileEditForm(studentData);
        },
        error: function(xhr) {
            showAlert('Failed to load profile data', 'danger');
        }
    });
}

function showProfileEditForm(student) {
    const formHtml = `
        <form id="editProfileForm" data-student-id="${student._id}">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" name="email" value="${student.email}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-control" name="phone" value="${student.phone || ''}">
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label">Department</label>
                <select class="form-select" name="department" required>
                    <option value="Computer Science" ${student.department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
                    <option value="Electronics" ${student.department === 'Electronics' ? 'selected' : ''}>Electronics</option>
                    <option value="Mechanical" ${student.department === 'Mechanical' ? 'selected' : ''}>Mechanical</option>
                    <option value="Civil" ${student.department === 'Civil' ? 'selected' : ''}>Civil</option>
                    <option value="Electrical" ${student.department === 'Electrical' ? 'selected' : ''}>Electrical</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Address</label>
                <textarea class="form-control" name="address" rows="3">${student.address || ''}</textarea>
            </div>
            <div class="alert alert-info">
                <small><i class="bi bi-info-circle"></i> You can edit Email, Phone, Department, and Address.</small>
            </div>
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-check-circle"></i> Save Changes
                </button>
                <button type="button" class="btn btn-secondary" id="cancelEditBtn">
                    <i class="bi bi-x-circle"></i> Cancel
                </button>
            </div>
        </form>
    `;

    $('#profileInfo').html(formHtml);
    
    // Add cancel button handler
    $('#cancelEditBtn').on('click', function() {
        loadStudentProfile();
    });
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => data[field.name] = field.value);

    $.ajax({
        url: `${API_URL}/api/students/${AppState.user.studentId}`,
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('Profile updated successfully!', 'success');
            loadStudentProfile();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to update profile', 'danger');
        }
    });
}

// ============= Search and Filter =============

function handleSearch() {
    const searchTerm = $('#searchInput').val();
    const filters = getActiveFilters();
    filters.search = searchTerm;
    loadStudents(filters);
}

function handleFilter() {
    const filters = getActiveFilters();
    loadStudents(filters);
}

function getActiveFilters() {
    const filters = {};
    const department = $('#departmentFilter').val();
    const year = $('#yearFilter').val();
    const status = $('#statusFilter').val();

    if (department) filters.department = department;
    if (year) filters.year = year;
    if (status) filters.status = status;

    return filters;
}

function clearFilters() {
    $('#searchInput').val('');
    $('#departmentFilter').val('');
    $('#yearFilter').val('');
    $('#statusFilter').val('');
    loadStudents();
}

// ============= Dark Mode =============

function toggleDarkMode() {
    $('body').toggleClass('dark-mode');
    const isDark = $('body').hasClass('dark-mode');
    
    if (isDark) {
        $('#darkModeToggle i').removeClass('bi-moon-fill').addClass('bi-sun-fill');
        localStorage.setItem('theme', 'dark');
    } else {
        $('#darkModeToggle i').removeClass('bi-sun-fill').addClass('bi-moon-fill');
        localStorage.setItem('theme', 'light');
    }
}

// ============= Helper Functions =============

function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
             style="z-index: 9999; min-width: 300px;" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    $('body').append(alertHtml);
    
    setTimeout(() => {
        $('.alert').alert('close');
    }, 3000);
}

function getStatusColor(status) {
    const colors = {
        'active': 'success',
        'inactive': 'warning',
        'graduated': 'info'
    };
    return colors[status] || 'secondary';
}

function getGradeColor(grade) {
    if (grade === 'A' || grade === 'A+') return 'success';
    if (grade === 'B' || grade === 'B+') return 'primary';
    if (grade === 'C') return 'warning';
    return 'danger';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getProjectStatusColor(status) {
    const colors = {
        'ongoing': 'warning',
        'completed': 'success',
        'submitted': 'info'
    };
    return colors[status] || 'secondary';
}

function getBookStatusColor(status) {
    const colors = {
        'borrowed': 'success',
        'returned': 'secondary',
        'overdue': 'danger'
    };
    return colors[status] || 'secondary';
}

// ============= Projects Functions =============

function showAddProjectModal() {
    const modalHtml = `
        <div class="modal fade" id="addProjectModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-folder-plus"></i> Add Project</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addProjectForm">
                            <div class="mb-3">
                                <label class="form-label">Project Title *</label>
                                <input type="text" class="form-control" name="title" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="description" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Technologies (comma separated)</label>
                                <input type="text" class="form-control" name="technologies" placeholder="React, Node.js, MongoDB">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">GitHub Link</label>
                                <input type="url" class="form-control" name="githubLink">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Live Demo Link</label>
                                <input type="url" class="form-control" name="liveLink">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="status">
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="submitted">Submitted</option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Add Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addProjectModal'));
    modal.show();

    $('#addProjectModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleAddProject(e) {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => {
        if (field.name === 'technologies' && field.value) {
            data[field.name] = field.value.split(',').map(t => t.trim());
        } else {
            data[field.name] = field.value;
        }
    });

    $.ajax({
        url: `${API_URL}/api/students/${AppState.user.studentId}/projects`,
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('Project added successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addProjectModal')).hide();
            loadStudentProfile();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to add project', 'danger');
        }
    });
}

function handleEditProject(e) {
    const projectId = $(e.currentTarget).data('project-id');
    showAlert('Edit project feature - coming soon!', 'info');
}

function handleDeleteProject(e) {
    const projectId = $(e.currentTarget).data('project-id');
    
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    $.ajax({
        url: `${API_URL}/api/students/${AppState.user.studentId}/projects/${projectId}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function() {
            showAlert('Project deleted successfully!', 'success');
            loadStudentProfile();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to delete project', 'danger');
        }
    });
}

// ============= Library Functions =============

function showBorrowBookModal() {
    const modalHtml = `
        <div class="modal fade" id="borrowBookModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-book"></i> Borrow Book</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="borrowBookForm">
                            <div class="mb-3">
                                <label class="form-label">Book Title *</label>
                                <input type="text" class="form-control" name="bookTitle" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Author</label>
                                <input type="text" class="form-control" name="author">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">ISBN</label>
                                <input type="text" class="form-control" name="isbn">
                            </div>
                            <div class="alert alert-info">
                                <small><i class="bi bi-info-circle"></i> Books must be returned within 14 days. Late fees: $5/day</small>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Borrow Book
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('borrowBookModal'));
    modal.show();

    $('#borrowBookModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleBorrowBook(e) {
    e.preventDefault();
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => data[field.name] = field.value);

    $.ajax({
        url: `${API_URL}/api/students/${AppState.user.studentId}/library/borrow`,
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('Book borrowed successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('borrowBookModal')).hide();
            loadStudentProfile();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to borrow book', 'danger');
        }
    });
}

function handleReturnBook(e) {
    const bookId = $(e.currentTarget).data('book-id');
    
    if (!confirm('Are you sure you want to return this book?')) {
        return;
    }

    $.ajax({
        url: `${API_URL}/api/students/${AppState.user.studentId}/library/${bookId}/return`,
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function(response) {
            const fine = response.book.fine;
            if (fine > 0) {
                showAlert(`Book returned! Late fee: $${fine}`, 'warning');
            } else {
                showAlert('Book returned successfully!', 'success');
            }
            loadStudentProfile();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to return book', 'danger');
        }
    });
}

// ============= Admin Grade Management =============

function showAddGradeModal(e) {
    const studentId = $(e.currentTarget).data('student-id');
    
    const modalHtml = `
        <div class="modal fade" id="addGradeModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-plus-circle"></i> Add Grade</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addGradeForm" data-student-id="${studentId}">
                            <div class="mb-3">
                                <label class="form-label">Subject *</label>
                                <input type="text" class="form-control" name="subject" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Marks *</label>
                                    <input type="number" class="form-control" name="marks" min="0" max="100" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Grade *</label>
                                    <select class="form-select" name="grade" required>
                                        <option value="">Select Grade</option>
                                        <option value="A+">A+</option>
                                        <option value="A">A</option>
                                        <option value="B+">B+</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="F">F</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Semester</label>
                                    <input type="number" class="form-control" name="semester" min="1" max="8">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Credits</label>
                                    <input type="number" class="form-control" name="credits" min="1" max="6">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Add Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('addGradeModal'));
    modal.show();

    $('#addGradeModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleAddGrade(e) {
    e.preventDefault();
    const studentId = $(e.target).data('student-id');
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => {
        if (field.value) {
            data[field.name] = field.name === 'marks' || field.name === 'semester' || field.name === 'credits' 
                ? parseInt(field.value) 
                : field.value;
        }
    });

    $.ajax({
        url: `${API_URL}/api/students/${studentId}/grades`,
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('Grade added successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addGradeModal')).hide();
            
            // Close and reopen student details modal
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewStudentModal'));
            if (viewModal) {
                viewModal.hide();
                setTimeout(() => {
                    // Reload student data
                    $.ajax({
                        url: `${API_URL}/api/students/${studentId}`,
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${AppState.token}` },
                        success: function(student) {
                            showStudentDetailsModal(student);
                        }
                    });
                }, 300);
            }
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to add grade', 'danger');
        }
    });
}

function showEditGradeModal(e) {
    const studentId = $(e.currentTarget).data('student-id');
    const gradeId = $(e.currentTarget).data('grade-id');
    const subject = $(e.currentTarget).data('subject');
    const marks = $(e.currentTarget).data('marks');
    const grade = $(e.currentTarget).data('grade');
    const semester = $(e.currentTarget).data('semester');
    const credits = $(e.currentTarget).data('credits');
    
    const modalHtml = `
        <div class="modal fade" id="editGradeModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-pencil-square"></i> Edit Grade</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editGradeForm" data-student-id="${studentId}" data-grade-id="${gradeId}">
                            <div class="mb-3">
                                <label class="form-label">Subject *</label>
                                <input type="text" class="form-control" name="subject" value="${subject}" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Marks *</label>
                                    <input type="number" class="form-control" name="marks" min="0" max="100" value="${marks}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Grade *</label>
                                    <select class="form-select" name="grade" required>
                                        <option value="">Select Grade</option>
                                        <option value="A+" ${grade === 'A+' ? 'selected' : ''}>A+</option>
                                        <option value="A" ${grade === 'A' ? 'selected' : ''}>A</option>
                                        <option value="B+" ${grade === 'B+' ? 'selected' : ''}>B+</option>
                                        <option value="B" ${grade === 'B' ? 'selected' : ''}>B</option>
                                        <option value="C" ${grade === 'C' ? 'selected' : ''}>C</option>
                                        <option value="D" ${grade === 'D' ? 'selected' : ''}>D</option>
                                        <option value="F" ${grade === 'F' ? 'selected' : ''}>F</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Semester</label>
                                    <input type="number" class="form-control" name="semester" min="1" max="8" value="${semester || ''}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Credits</label>
                                    <input type="number" class="form-control" name="credits" min="1" max="6" value="${credits || ''}">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Update Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editGradeModal'));
    modal.show();

    $('#editGradeModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleEditGrade(e) {
    e.preventDefault();
    const studentId = $(e.target).data('student-id');
    const gradeId = $(e.target).data('grade-id');
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => {
        if (field.value) {
            data[field.name] = field.name === 'marks' || field.name === 'semester' || field.name === 'credits' 
                ? parseInt(field.value) 
                : field.value;
        }
    });

    $.ajax({
        url: `${API_URL}/api/students/${studentId}/grades/${gradeId}`,
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('Grade updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editGradeModal')).hide();
            
            // Close and reopen student details modal
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewStudentModal'));
            if (viewModal) {
                viewModal.hide();
                setTimeout(() => {
                    // Reload student data
                    $.ajax({
                        url: `${API_URL}/api/students/${studentId}`,
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${AppState.token}` },
                        success: function(student) {
                            showStudentDetailsModal(student);
                        }
                    });
                }, 300);
            }
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to update grade', 'danger');
        }
    });
}

function handleDeleteGrade(e) {
    const studentId = $(e.currentTarget).data('student-id');
    const gradeId = $(e.currentTarget).data('grade-id');
    
    if (!confirm('Are you sure you want to delete this grade?')) {
        return;
    }

    $.ajax({
        url: `${API_URL}/api/students/${studentId}/grades/${gradeId}`,
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${AppState.token}` },
        success: function() {
            showAlert('Grade deleted successfully!', 'success');
            
            // Close and reopen student details modal
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewStudentModal'));
            if (viewModal) {
                viewModal.hide();
                setTimeout(() => {
                    $.ajax({
                        url: `${API_URL}/api/students/${studentId}`,
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${AppState.token}` },
                        success: function(student) {
                            showStudentDetailsModal(student);
                        }
                    });
                }, 300);
            }
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to delete grade', 'danger');
        }
    });
}

function showGradeProjectModal(e) {
    const studentId = $(e.currentTarget).data('student-id');
    const projectId = $(e.currentTarget).data('project-id');
    
    const modalHtml = `
        <div class="modal fade" id="gradeProjectModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-star"></i> Grade Project</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="gradeProjectForm" data-student-id="${studentId}" data-project-id="${projectId}">
                            <div class="mb-3">
                                <label class="form-label">Project Grade *</label>
                                <select class="form-select" name="grade" required>
                                    <option value="">Select Grade</option>
                                    <option value="A+">A+ (Excellent)</option>
                                    <option value="A">A (Very Good)</option>
                                    <option value="B+">B+ (Good)</option>
                                    <option value="B">B (Above Average)</option>
                                    <option value="C">C (Average)</option>
                                    <option value="D">D (Below Average)</option>
                                    <option value="F">F (Fail)</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Status</label>
                                <select class="form-select" name="status">
                                    <option value="submitted">Submitted</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Submit Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('gradeProjectModal'));
    modal.show();

    $('#gradeProjectModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleGradeProject(e) {
    e.preventDefault();
    const studentId = $(e.target).data('student-id');
    const projectId = $(e.target).data('project-id');
    const formData = $(e.target).serializeArray();
    const data = {};
    formData.forEach(field => data[field.name] = field.value);

    $.ajax({
        url: `${API_URL}/api/students/${studentId}/projects/${projectId}`,
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function(response) {
            showAlert('Project graded successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('gradeProjectModal')).hide();
            
            // Close and reopen student details modal
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewStudentModal'));
            if (viewModal) {
                viewModal.hide();
                setTimeout(() => {
                    $.ajax({
                        url: `${API_URL}/api/students/${studentId}`,
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${AppState.token}` },
                        success: function(student) {
                            showStudentDetailsModal(student);
                        }
                    });
                }, 300);
            }
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to grade project', 'danger');
        }
    });
}

// ============= Admin Attendance & Status Management =============

function showEditAttendanceModal(e) {
    const studentId = $(e.currentTarget).data('student-id');
    const currentAttendance = $(e.currentTarget).data('attendance');
    
    const modalHtml = `
        <div class="modal fade" id="editAttendanceModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-calendar-check"></i> Update Attendance</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editAttendanceForm" data-student-id="${studentId}">
                            <div class="mb-3">
                                <label class="form-label">Attendance Percentage</label>
                                <input type="number" class="form-control" name="attendance" min="0" max="100" 
                                       value="${currentAttendance}" required>
                                <small class="text-muted">Enter percentage from 0 to 100</small>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Update Attendance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editAttendanceModal'));
    modal.show();

    $('#editAttendanceModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleEditAttendance(e) {
    e.preventDefault();
    const studentId = $(e.target).data('student-id');
    const attendance = parseInt($('#editAttendanceForm input[name="attendance"]').val());

    $.ajax({
        url: `${API_URL}/api/students/${studentId}`,
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ attendance: attendance }),
        success: function(response) {
            showAlert('Attendance updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editAttendanceModal')).hide();
            
            // Refresh student details modal
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewStudentModal'));
            if (viewModal) {
                viewModal.hide();
                setTimeout(() => {
                    $.ajax({
                        url: `${API_URL}/api/students/${studentId}`,
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${AppState.token}` },
                        success: function(student) {
                            showStudentDetailsModal(student);
                        }
                    });
                }, 300);
            }
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to update attendance', 'danger');
        }
    });
}

function showEditStatusModal(e) {
    const studentId = $(e.currentTarget).data('student-id');
    const currentStatus = $(e.currentTarget).data('status');
    
    const modalHtml = `
        <div class="modal fade" id="editStatusModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-person-badge"></i> Update Status</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editStatusForm" data-student-id="${studentId}">
                            <div class="mb-3">
                                <label class="form-label">Student Status</label>
                                <select class="form-select" name="status" required>
                                    <option value="active" ${currentStatus === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${currentStatus === 'inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="graduated" ${currentStatus === 'graduated' ? 'selected' : ''}>Graduated</option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-check-circle"></i> Update Status
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editStatusModal'));
    modal.show();

    $('#editStatusModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
}

function handleEditStatus(e) {
    e.preventDefault();
    const studentId = $(e.target).data('student-id');
    const status = $('#editStatusForm select[name="status"]').val();

    $.ajax({
        url: `${API_URL}/api/students/${studentId}`,
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${AppState.token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ status: status }),
        success: function(response) {
            showAlert('Status updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editStatusModal')).hide();
            
            // Refresh student details modal and list
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewStudentModal'));
            if (viewModal) {
                viewModal.hide();
                setTimeout(() => {
                    $.ajax({
                        url: `${API_URL}/api/students/${studentId}`,
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${AppState.token}` },
                        success: function(student) {
                            showStudentDetailsModal(student);
                        }
                    });
                }, 300);
            }
            // Also refresh the student list
            loadStudents();
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to update status', 'danger');
        }
    });
}

// ============= Profile Photo Upload =============

// Handle photo upload
$(document).on('change', '#photoUploadInput', function(e) {
    const file = e.target.files[0];
    const studentId = $(this).data('student-id');
    
    if (!file) {
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showAlert('Please select an image file', 'danger');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('Image size should be less than 5MB', 'danger');
        return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = function(e) {
        $('#profilePhotoPreview').attr('src', e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const formData = new FormData();
    formData.append('photo', file);

    // Show loading state
    const uploadBtn = $('.upload-photo-btn');
    const originalHtml = uploadBtn.html();
    uploadBtn.html('<i class="bi bi-hourglass-split"></i>').prop('disabled', true);

    $.ajax({
        url: `${API_URL}/api/students/${studentId}/photo`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AppState.token}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            showAlert('Profile photo updated successfully!', 'success');
            uploadBtn.html(originalHtml).prop('disabled', false);
            
            // Update the photo in app state if viewing own profile
            if (AppState.user && AppState.user._id === studentId) {
                AppState.user.photo = response.photoPath;
            }
        },
        error: function(xhr) {
            showAlert(xhr.responseJSON?.message || 'Failed to upload photo', 'danger');
            uploadBtn.html(originalHtml).prop('disabled', false);
            // Revert preview on error
            $('#profilePhotoPreview').attr('src', AppState.user?.photo || '');
        }
    });
});

