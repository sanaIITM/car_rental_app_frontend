# 🚗 Car Rental System – Frontend

Frontend application for the Car Rental System built using **React (Vite), Axios, and React Router**.

---

## 🛠 Tech Stack

* React (Vite)
* React Router DOM
* Axios
* Context API (Authentication)
* CSS (Custom Styling)

---

## 📁 Project Structure

```
frontend/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Bookings.jsx
│   │   └── AdminBookings.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

## 🔐 Authentication Flow

* User logs in via `/login`
* JWT token stored in `localStorage`
* Axios interceptor automatically attaches token to requests
* Protected routes restrict access based on role

---

## 📄 Pages Implemented

* Home (View Available Cars)
* Login
* Signup
* Admin Dashboard (Manage Cars)
* My Bookings
* Admin Bookings (View All Bookings)

---

## 🔗 API Integration

The frontend communicates with the backend using Axios.

Example configuration:

```javascript
const api = axios.create({
  baseURL: "http://localhost:5000"
});
```

Authorization header automatically attached using interceptor.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone <repository-url>
cd frontend
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Start Development Server

```
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

## 🌍 Environment Variables

Create `.env` file if needed:

```
VITE_API_URL=http://localhost:5000
```

Then use in Axios config:

```javascript
baseURL: import.meta.env.VITE_API_URL
```

---

## ✅ Features Implemented

* Authentication UI
* Role-based Navigation
* Date-based Booking System
* Admin Car Management
* Admin Booking View
* Protected Routes
* Responsive Layout

---

## 🚀 Deployment

Frontend can be deployed on:

* Vercel
* Netlify
* Render Static Site

Make sure backend URL is updated before deployment.

---

## 👩‍💻 Author

Sana Salim
