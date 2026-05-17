import express from "express";
import cors from 'cors';
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import cookieParser from "cookie-parser";
const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());
// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
// test route
app.get("/", (req, res) => {
  res.send("Task Management System");
});

// Error handling middleware
app.use(errorHandler);


export default app;