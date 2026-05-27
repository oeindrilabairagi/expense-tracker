# Expense Tracker Web Application

## Project Overview

Expense Tracker is a full-stack Single-Page Application (SPA) designed to help users efficiently track, manage, and analyse their personal expenses.

The application allows users to securely register and log in, record expenses, categorise spending, and visualise financial insights through interactive dashboards and charts. It also includes an admin management system for monitoring user activities and managing accounts.

The project focuses on combining responsive frontend design, secure authentication, role-based access control, and interactive data visualisation into a modern web application experience.

---

# Tech Stack

## Frontend
- React.js (Functional Components + Hooks)
- Recharts (Data Visualisation)
- CSS (Responsive custom styling)
- Fetch API

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt password hashing

## Database
- MySQL

## Development Tools
- Vite
- VS Code
- Git & GitHub

---

# Features

## Authentication & User Management
- User registration and login system
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Persistent login sessions using localStorage
- User profile management
- Update display name
- Update email address
- Change password securely

---

## Expense Management
- Add expenses with validation
- View expenses
- Edit expenses
- Delete expenses with confirmation modal
- User-specific expense isolation
- Real-time expense updates

---

## Search, Filter & Sorting
- Live search filtering for expenses
- Category-based filtering
- Sorting by newest, oldest, highest amount, and lowest amount

---

## Analytics & Visualisation
- Expense summary dashboard
- Pie chart category breakdown
- Monthly spending trend analysis
- Yearly spending trend analysis
- Peak spending insights
- Interactive trend modals

---

## Admin Features
- Role-based admin access
- Admin panel dashboard
- View all users
- Delete user accounts
- Monitor activity logs
- Search/filter users and activity logs
- Activity tracking for:
  - Login
  - Logout
  - Create expense
  - Edit expense
  - Delete expense

---

## UI / UX Features
- Responsive dashboard layout
- Modern card-based UI
- Modal-based workflows
- Error handling and retry mechanisms
- Interactive hover effects and transitions
- Blurred background authentication overlay

---

# Application Workflow

1. Users can create an account and securely log into the application.
2. After logging in, users can add new expenses by entering details such as title, category, amount, date, and description.
3. Users can view all their saved expenses in a dedicated expense management section.
4. Expenses can be searched, filtered, sorted, edited, or deleted in real time.
5. The dashboard automatically generates spending summaries and visual insights using charts and trend analysis.
6. Users can open their profile to view and update account information such as display name, email, and password.
7. Admin users have access to an admin panel where they can manage user accounts and monitor system activity logs.
8. All expense data and user actions are securely handled through protected backend routes and authenticated sessions.

---

# Folder Structure

```plaintext
/client
 ├── src
 │   ├── components
 │   ├── services
 │   ├── utils
 │   ├── constants
 │   ├── App.jsx
 │   └── App.css

/server
 ├── server.js
 ├── node_modules
 └── package.json
```

---

# Database Setup

## Create Database

Run the provided SQL setup file inside MySQL Workbench.

This creates:
- `expense_tracker_db`
- `users` table
- `expenses` table
- `user_activity` table

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/oeindrilabairagi/expense-tracker.git
cd expense-tracker
```

---

## 2. Install Backend Dependencies

```bash
cd Server
npm install
```

---

## 3. Install Frontend Dependencies

Open a new terminal:

```bash
cd Client
npm install
```

---

# Configure MySQL

Inside:

```plaintext
Server/server.js
```

Update:

```js
host: "localhost",
user: "root",
password: "root123",
database: "expense_tracker_db",
```

to match your local MySQL configuration.

---

# Run the Application

## Start Backend

```bash
cd Server
npm run dev
```

Backend runs on:

```plaintext
http://localhost:5000
```

---

## Start Frontend

```bash
cd Client
npm run dev
```

Frontend typically runs on:

```plaintext
http://localhost:5173
```

---

# Security Implementation

## Password Hashing
Passwords are securely hashed using bcrypt before being stored in the database. This prevents plaintext password exposure and improves application security.

## JWT Authentication
JWT tokens are generated during login and stored locally to maintain authenticated sessions. Protected backend routes verify tokens before allowing access.

## Protected User Data
Users can only access and manage their own expenses. Middleware validates ownership before CRUD operations are performed.

## Role-Based Access Control
Admin-specific functionality is restricted using backend middleware that validates user roles before granting access.

---

# Challenges & Solutions

## Managing Complex UI State
The application contains multiple interactive modals and dashboards. React Hooks and structured component separation were used to maintain clean state management.

## Implementing Secure Authentication
JWT authentication and bcrypt hashing were integrated to provide secure login functionality while protecting user credentials and API routes.

## User-Based Data Isolation
Expense operations were redesigned to associate records with authenticated users, ensuring proper access control and data privacy.

## Admin Monitoring System
An activity logging system was implemented to track authentication and CRUD operations, enabling admin-level monitoring and management.

## Error Handling
API and database failure states are handled with user-friendly error messages and retry mechanisms.

---

# Future Improvements

- Profile image uploads
- Email verification
- Forgot password functionality
- Budget goals and alerts
- Export expenses as CSV/PDF
- Dark mode support
- Improved accessibility support

---

# Author

Developed by **Oeindrila Bairagi (25544685)**  
32516 - Internet Programming