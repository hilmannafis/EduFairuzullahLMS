# Edu Fairuzullah LMS - Prototype

A basic HTML-based Learning Management System prototype with CRUD operations, authentication, and role-based access control.

## Features

### Authentication & Authorization
- User registration and login
- Role-based access control (Educator and Learner)
- Secure session management

### Course Management (Educator)
- Create new courses
- View all courses
- Edit existing courses
- Delete courses
- Course fields: Title, Description, Category, Duration

### User Management (Educator)
- View all users
- Create new users
- Edit existing users
- Delete users
- Assign roles (Educator/Learner)

### Learner Features
- Browse available courses
- Enroll in courses
- View enrolled courses
- Unenroll from courses

## Default Login Credentials

### Educator Account
- **Email:** educator@edufairuzullah.com
- **Password:** password123

### Learner Account
- **Email:** learner@edufairuzullah.com
- **Password:** password123

## How to Use

1. **Open the application:**
   - Simply open `index.html` in a web browser
   - No server setup required (uses localStorage for data persistence)

2. **Login:**
   - Use one of the default accounts above, or
   - Register a new account by clicking "Register here"

3. **As an Educator:**
   - Create and manage courses
   - Manage users (create, edit, delete)
   - View all courses you've created

4. **As a Learner:**
   - Browse available courses
   - Enroll in courses
   - View your enrolled courses

## File Structure

```
project cloud/
├── index.html          # Login/Registration page
├── dashboard.html      # Role-based dashboard redirect
├── educator.html       # Educator dashboard with course & user management
├── learner.html        # Learner dashboard with course browsing
├── app.js              # Core application logic and data management
├── styles.css          # Styling and UI design
└── README.md           # This file
```

## Technical Details

- **Frontend:** Pure HTML, CSS, and JavaScript
- **Data Storage:** Browser localStorage (persists data locally)
- **Authentication:** Session-based using localStorage
- **No Backend Required:** Fully client-side prototype

## Cloud Deployment

This prototype can be deployed to any static hosting service:
- **Azure:** Azure Static Web Apps
- **AWS:** S3 + CloudFront
- **Google Cloud:** Firebase Hosting
- **Other:** Any static file hosting service

Simply upload all HTML, CSS, and JS files to your hosting service.

## Notes

- This is a prototype using localStorage, so data persists only in the browser
- For production, you would need a backend API and database
- Passwords are stored in plain text (for prototype purposes only)
- All data is stored locally in the browser

## Browser Compatibility

Works on all modern browsers that support:
- HTML5
- CSS3
- ES6 JavaScript
- localStorage API

