# 🌿 LeafyLife

A full-stack plant monitoring web application that helps users track their houseplants, manage watering schedules, and keep their green friends healthy.

## 📌 About

LeafyLife is a MERN stack application built as a learning project to practice full-stack development. Users can register, log in securely, and manage a personal collection of plants — adding photos, tracking water status, and getting reminders on a weekly watering calendar.

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login & registration with password hashing (bcrypt)
- 🌱 **Plant Management** — Add, edit, and delete plants with photos
- 💧 **Watering Calendar** — Weekly schedule showing which plants need water
- 🔍 **Search & Filter** — Quickly find plants by name or water status
- 📊 **Live Dashboard** — Stats overview (total plants, thirsty plants, watered plants)
- 🔔 **Toast Notifications** — Real-time feedback for every action
- 🎨 **Modern UI** — Glassmorphism design with smooth animations
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Bootstrap 5
- Axios
- React Toastify
- Font Awesome

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## 📂 Project Structure

```
leafylife/
├── plant/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   ├── assets/     # Images
│   │   └── App.jsx
│   └── package.json
│
└── plant-backend/      # Backend (Node + Express)
    ├── models/         # Mongoose schemas
    ├── routes/         # API routes
    ├── middleware/     # JWT auth middleware
    ├── server.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd plant-backend
npm install
```

Create a `.env` file in `plant-backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd plant
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/plants/all` | Get all plants (protected) |
| POST | `/api/plants/add` | Add a new plant (protected) |
| PUT | `/api/plants/update-status/:id` | Update plant water status (protected) |
| DELETE | `/api/plants/delete/:id` | Delete a plant (protected) |

## 🙋‍♀️ Author

**Kavisri**
Aspiring Full Stack Developer | MERN Stack

## 📄 License

This project is open source and available for learning purposes.
