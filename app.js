// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Current User Storage (session only)
const CURRENT_USER_KEY = 'lms_current_user';

// ============================================
// API Helper Functions
// ============================================

async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            let errorMessage = 'Request failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // Re-throw with more context if it's a network error
        if (error.message.includes('fetch') || error.name === 'TypeError') {
            throw new Error('Cannot connect to server. Make sure the server is running on http://localhost:3000');
        }
        throw error;
    }
}

// ============================================
// User Management Functions (API)
// ============================================

async function getAllUsers() {
    try {
        return await apiCall('/users');
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

async function getUserByEmail(email) {
    try {
        const users = await getAllUsers();
        return users.find(user => user.email === email);
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}

async function getUserById(id) {
    try {
        return await apiCall(`/users/${id}`);
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

async function createUser(userData) {
    try {
        return await apiCall('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function updateUser(userId, userData) {
    try {
        return await apiCall(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function removeUser(userId) {
    try {
        return await apiCall(`/users/${userId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// ============================================
// Course Management Functions (API)
// ============================================

async function getAllCourses() {
    try {
        return await apiCall('/courses');
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}

async function getCourseById(courseId) {
    try {
        return await apiCall(`/courses/${courseId}`);
    } catch (error) {
        console.error('Error fetching course:', error);
        return null;
    }
}

async function getCoursesByEducator(educatorId) {
    try {
        return await apiCall(`/courses?educatorId=${educatorId}`);
    } catch (error) {
        console.error('Error fetching courses by educator:', error);
        return [];
    }
}

async function createCourse(courseData) {
    try {
        return await apiCall('/courses', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

async function updateCourse(courseId, courseData) {
    try {
        return await apiCall(`/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(courseData)
        });
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

async function removeCourse(courseId) {
    try {
        return await apiCall(`/courses/${courseId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
}

// ============================================
// Enrollment Management Functions (API)
// ============================================

async function getAllEnrollments() {
    try {
        // Note: This endpoint might not exist, using user-specific endpoint
        return [];
    } catch (error) {
        return [];
    }
}

async function getEnrolledCourseIds(userId) {
    try {
        const enrollments = await apiCall(`/enrollments/${userId}`);
        return enrollments.map(e => e.courseId);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        return [];
    }
}

async function enrollUserInCourse(userId, courseId) {
    try {
        return await apiCall('/enrollments', {
            method: 'POST',
            body: JSON.stringify({ userId, courseId })
        });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        throw error;
    }
}

async function unenrollUserFromCourse(userId, courseId) {
    try {
        return await apiCall(`/enrollments/${userId}/${courseId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error unenrolling from course:', error);
        throw error;
    }
}

// ============================================
// Materials Functions (API)
// ============================================

async function getMaterials(courseId) {
    try {
        const query = courseId ? `/materials?courseId=${courseId}` : '/materials';
        return await apiCall(query);
    } catch (error) {
        console.error('Error fetching materials:', error);
        return [];
    }
}

async function createMaterial(material) {
    try {
        return await apiCall('/materials', {
            method: 'POST',
            body: JSON.stringify(material)
        });
    } catch (error) {
        console.error('Error creating material:', error);
        throw error;
    }
}

async function deleteMaterial(materialId) {
    try {
        return await apiCall(`/materials/${materialId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting material:', error);
        throw error;
    }
}

// ============================================
// Authentication Functions
// ============================================

function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

async function authenticateUser(email, password) {
    try {
        const user = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (user) {
            setCurrentUser(user);
            return user;
        }
        return null;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

// ============================================
// UI Helper Functions
// ============================================

function showMessage(message, type = 'error') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message message-${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

function showRegister() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            window.location.href = 'dashboard.html';
        } else {
            showMessage('Invalid email or password', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        let errorMsg = 'Login failed. ';
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            errorMsg += 'Cannot connect to server. Please make sure the server is running on http://localhost:3000';
        } else {
            errorMsg += error.message || 'Please check if the server is running.';
        }
        showMessage(errorMsg, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    try {
        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            showMessage('Email already registered', 'error');
            return;
        }

        await createUser({ name, email, password, role });
        showMessage('Registration successful! Please login.', 'success');
        setTimeout(() => {
            showLogin();
            document.getElementById('registerFormElement').reset();
        }, 1500);
    } catch (error) {
        console.error('Registration error:', error);
        let errorMsg = 'Registration failed. ';
        if (error.message.includes('fetch')) {
            errorMsg += 'Cannot connect to server. Please make sure the server is running on http://localhost:3000';
        } else {
            errorMsg += error.message || 'Please try again.';
        }
        showMessage(errorMsg, 'error');
    }
}

function logout() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
