# System & Software Requirements

To run **FeedByMe**, ensure your environment meets the following requirements.

## 💻 System Requirements
- **Operating System**: Windows, macOS, or Linux.
- **Node.js**: Version `18.x` or higher.
- **Package Manager**: `npm` (comes with Node) or `yarn`.
- **Database**: **MongoDB** (Local Community Edition or MongoDB Atlas cloud).
- **RAM**: Minimum 4GB (Recommended 8GB for smooth development).

## 📦 Key Software Dependencies

### Backend (Node.js/Express)
- `express`: Web framework.
- `mongoose`: MongoDB object modeling.
- `jsonwebtoken`: Secure token-based authentication.
- `bcryptjs`: Password hashing.
- `multer`: Middleware for handling image/screenshot uploads.
- `cors`: Cross-Origin Resource Sharing.
- `dotenv`: Environment variable management.

### Frontend (React/Vite)
- `react` & `react-dom`: UI library.
- `react-router-dom`: Frontend routing.
- `axios`: HTTP client for API calls.
- `react-hot-toast`: Toast notifications.
- `react-icons`: Icon sets (Heroicons, etc.).
- `recharts`: Data visualization charts.

## ⚙️ Environment Configuration
You will need to set up the following variables in your `/server/.env` file:
- `MONGO_URI`: The connection string for your MongoDB instance.
- `JWT_SECRET`: A secure string used for signing authentication tokens.
- `PORT`: (Optional) The port your server will run on (default: 5000).
