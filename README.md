# 🎥 Video Processing & Streaming Platform

A full-stack application that allows users to upload videos, analyze them for sensitive content, and stream them with real-time processing updates.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
  - **Viewer** → Read-only access
  - **Editor** → Upload & manage own videos
  - **Admin** → Full access to all videos

---

### 📤 Video Management
- Upload videos with metadata (title, description)
- Secure file storage using Multer
- Delete and update video details
- Multi-tenant isolation (users access only their own content)

---

### ⚙️ Video Processing Pipeline
1. Upload validation (file type & size)
2. Metadata extraction (duration, resolution)
3. Sensitivity analysis (safe / flagged)
4. Processing status updates
5. Final video ready for streaming

---

### 📡 Real-Time Updates
- Live processing updates using Socket.io
- Progress tracking (0% → 100%)
- Real-time UI updates

---

### 🎬 Video Streaming
- HTTP Range Requests support
- Smooth video playback
- Token-based secure streaming

---

### 📊 Dashboard Features
- Video library with filters
- Real-time processing monitor
- Status indicators (Processing, Safe, Flagged)
- Search & filtering (status, sensitivity)

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.io
- Multer (file uploads)
- JWT Authentication

### Frontend
- React (Vite)
- Context API
- Axios
- Tailwind CSS
- Socket.io Client

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/pardhan03/Pulse-Assignment

cd backend
npm install

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/Pulse-Assignment
JWT_SECRET=Manish
VITE_URL=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```