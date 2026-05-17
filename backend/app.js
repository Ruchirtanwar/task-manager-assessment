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
app.use(cors({
  origin: true,
  credentials: true,
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