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

## Author

Developed by Oeindrila Bairagi (25544685) as part of Assignment 1 for 32516 - Internet Programming.