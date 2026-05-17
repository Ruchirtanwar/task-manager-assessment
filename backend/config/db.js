import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Reusing existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Disable Mongoose buffering to prevent Vercel serverless timeouts
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;