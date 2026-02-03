import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.DATABASE_URL || 'mongodb://localhost:27017/movie-db';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectDB;
