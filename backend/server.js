import dotenv from 'dotenv';
// Load env vars
dotenv.config();
import connectDB from './config/db.js';
import app from './app.js';

// Connect to database
await connectDB();

// Only listen on PORT when running locally (not in serverless/production Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;