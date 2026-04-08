# Expense Tracker Web Application

## Project Overview

This project is a Single-Page Application (SPA) designed to help users efficiently track, manage, and analyse their daily expenses. The system allows users to record expenses, categorise them, and gain insights through visual summaries and trend analysis.

The application addresses the common problem of lack of visibility into personal spending habits by providing clear breakdowns and interactive charts, enabling users to make better financial decisions.

---

## Tech Stack

**Frontend:**

* React.js (Functional Components + Hooks)
* Recharts (Data Visualisation)
* CSS (Custom styling, responsive layout)

**Backend:**

* Node.js with Express
* MySQL (Database)

**Other:**

* Fetch API (for client-server communication)
* Local development using VS Code

---

## Features

* Login system (modal-based UI)
* Add new expenses with validation
* View all expenses with filtering and sorting
* Edit existing expenses
* Delete expenses with confirmation popup
* Category-based expense summary (Pie Chart)
* Monthly spending trend (Line Chart)
* Yearly trend analysis with category breakdown
* Dynamic filtering (category + sort options)
* Error handling with retry mechanism (API failure handling)
* Interactive UI with modals and hover effects
* Responsive layout for different screen sizes


## Authentication Note (Assignment Scope)

The login and signup interfaces are implemented primarily for UI demonstration purposes and to support overall application flow.

Basic validation is included:
- Fields cannot be left empty (login & signup)
- Password and confirm password must match (signup)

However, full authentication logic (e.g., secure user verification, password hashing, session management, and database-backed user accounts) has not been implemented, as it was not a requirement of the assignment. 

The core focus of this project is the expense tracking functionality and SPA behaviour.

---

## Application Logic & Workflow

1. User logs into the application via a modal interface.
2. Dashboard displays:

   * Total spending
   * Top spending category
   * Number of entries
3. Users can:

   * Add new expenses
   * View, edit, or delete existing entries
4. Data is dynamically fetched from the backend and rendered without page reloads (SPA behaviour).
5. Visual insights are provided through:

   * Category distribution (pie chart)
   * Monthly and yearly trends (line charts)
6. Error states (e.g., backend failure) are handled gracefully with user feedback and retry options.

---

## Folder Structure (Simplified)

```
/client
  ├── src
  │   ├── App.jsx        # Main application logic and UI
  │   ├── App.css        # Styling and layout
  │   └── index.js       # Entry point

/server
  ├── index.js           # Express server setup
  ├── routes             # API endpoints (CRUD operations)
  └── database           # MySQL connection & queries
```

---

## How to Run the Application

### 1. Clone the Repository

```bash
git clone https://github.com/oeindrilabairagi/expense-tracker.git
cd expense-tracker
```

---

### 2. Setup

#### 2.1 Set Up the Database (MySQL)

Open MySQL Workbench or your MySQL terminal and run the `db_setup.sql` file located in the root directory.

This will:
- Create a database named `expense_tracker_db`
- Create the `expenses` table
- Add a `created_at` timestamp column

---

#### 2.2 Configure Database Connection

In `Server/server.js`, ensure your MySQL credentials match your local setup:

```javascript
host: 'localhost',
user: 'root',
password: 'root123',
database: 'expense_tracker_db'
```

You can either:
- Use the same credentials in your MySQL setup, or  
- Modify these values in `server.js` to match your local configuration

---

#### 2.3 Install Backend Dependencies

```bash
cd Server
npm install
```

---

#### 2.4 Install Frontend Dependencies

Open a new terminal and run:

```bash
cd Client
npm install
```

---

### 3. Run the Application

#### 3.1 Start the Backend Server

```bash
cd Server
npm run dev
```

The backend server will run on:

```
http://localhost:5000
```

---

#### 3.2 Start the Frontend

Open a new terminal and run:

```bash
cd Client
npm run dev
```

Vite will provide a local development URL, typically:

```
http://localhost:5173
```

Open this in your browser.

---

### 4. Important Note

The frontend communicates with the backend via:

```
http://localhost:5000/expenses
```

Ensure that **both the frontend and backend servers are running simultaneously** for the application to function correctly.

---

## Challenges & Solutions

One of the main challenges was managing complex UI state within a single-page application, especially with multiple modals (add, edit, delete, trends, login). This was addressed using structured state management with React hooks.

Another challenge was handling API failures (e.g., when the database is down). Initially, the application failed silently, but this was improved by introducing error states and a retry mechanism, ensuring the UI remains informative and user-friendly.

Design consistency and layout responsiveness were also challenging due to multiple interactive components. This was solved by creating reusable styling patterns and maintaining a consistent visual hierarchy across the application.

---

## Future Improvements

* Implement real authentication with backend user management
* Add persistent login sessions
* Introduce budget tracking and alerts
* Improve accessibility (keyboard navigation, ARIA labels)
* Optimise component structure by separating into reusable components

---

## Screenshots

### Login
![Login](/Assignment%201/screenshots/2026-04-08_23h03_01.png)

### Dashboard
![Dashboard](/Assignment%201/screenshots/2026-04-08_23h03_18.png)
![Dashboard](/Assignment%201/screenshots/2026-04-08_23h03_27.png)

### Add New Expense
![Add New Expense](/Assignment%201/screenshots/2026-04-08_23h03_56.png)

### View, Edit and Delete Expense
![View, Edit and Delete Expense](/Assignment%201/screenshots/2026-04-08_23h04_05.png)

### Monthly View of Spending Trend
![Monthly View of Spending Trend](/Assignment%201/screenshots/2026-04-08_23h04_29.png)
![Monthly View of Spending Trend](/Assignment%201/screenshots/2026-04-08_23h04_33.png)

### Yearly View of Spending Trend
![Yearly View of Spending Trend](/Assignment%201/screenshots/2026-04-08_23h04_46.png)

---

## Author

Developed by Oeindrila Bairagi (25544685) as part of Assignment 1 for 32516 - Internet Programming.