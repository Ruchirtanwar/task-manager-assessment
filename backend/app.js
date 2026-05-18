import express from "express";
import cors from 'cors';
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cookieParser from "cookie-parser";
const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// Robust CORS resolver for local development and Vercel deployments
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === origin) return true;
      // Allow any Vercel preview branch deployment if CLIENT_URL is on Vercel
      if (allowed.includes('vercel.app') && origin.endsWith('.vercel.app')) {
        return true;
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
//testing route
app.get("/",(req,res)=>{
  res.send("testing task manager routes")
})
// Error handling middleware
app.use(errorHandler);

export default app;