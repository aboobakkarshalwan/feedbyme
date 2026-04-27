# FeedByMe — Multi-Project Feedback Portal

A powerful, professional, and shareable feedback management system. Build dedicated feedback boards for different projects, collect ratings, and act on user insights—all in one place.

## 🚀 Key Features

### 📋 Multi-Project Feedback Boards
- **Dedicated Boards**: Create unique feedback boards for different apps, features, or projects.
- **Custom Branding**: Pick a unique **Theme Color** and upload a **Logo** for each board to match your brand.
- **Universal Sharing**: Copy a unique "Share Link" for any board and send it to your users/clients.

### 📝 Frictionless Feedback Collection
- **Guest Submissions**: Users can give feedback **without an account**. We just ask for an optional email.
- **Image Attachments**: Support for uploading screenshots and images to help explain feedback.
- **Simplified Rating**: Users can provide a quick 1-5 star rating along with their comments.
- **Anonymous Option**: Allow users to hide their identity if they prefer.

### 🔐 Security & Auth
- **JWT Authentication**: Secure login and registration.
- **Forgot Password**: Complete password reset workflow (with reset links logged to the server console in dev).
- **Role-Based Access**: 
  - **Board Owners**: Can moderate and delete any feedback on their own boards.
  - **Admins**: Full control over all boards, users, and global analytics.

### 🌌 Professional UI
- **Modern Glassmorphism**: A sleek, premium design with smooth animations.
- **Responsive**: Fully optimized for Mobile, Tablet, and Desktop.
- **Real-time Feedback**: Vote on feedback and leave comments.

---

## 🛠️ Tech Stack & Requirements

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6 |
| **Backend** | Node.js, Express.js, Multer (File Uploads) |
| **Database** | MongoDB (Mongoose ODM) |
| **Styling** | Vanilla CSS (Custom Design System) |

### System Requirements:
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher (Local or MongoDB Atlas)
- **Disk Space**: At least 100MB for image storage (`/server/uploads`)

---

## 🏃 How to Run

### 1. Prerequisites
Ensure you have **Node.js** and **MongoDB** installed and running on your machine.

### 2. Setup the Backend
1. Go to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/feedbyme
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```
4. Start the server: `npm run dev`

### 3. Setup the Frontend
1. Go to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the frontend: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing the "Forgot Password" Feature
Since there is no email provider (like SendGrid) configured yet, the reset link is **printed to your server terminal**. 
1. Go to Login > Forgot Password.
2. Enter your email.
3. Check the terminal where your backend is running.
4. Copy the link and paste it into your browser.

## 📂 Project Structure
- `/client`: React frontend (Vite)
- `/server`: Node.js Express backend
- `/server/uploads`: Directory where user-uploaded screenshots are stored.

---

## 📄 License
MIT License
