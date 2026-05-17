import mongoose from 'mongoose';

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);
   console.log("database connected succesfully");
   

  } catch (error) {

    console.error(`Error connecting to MongoDB: ${error.message}`);

   
  }
};

export default connectDB;