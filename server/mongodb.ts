import mongoose from 'mongoose';

// Check for MongoDB URL, fallback to in-memory if not available
const mongoUrl = process.env.MONGODB_URL;

export async function connectToMongoDB() {
  if (!mongoUrl) {
    console.log('No MONGODB_URL found, using in-memory storage. Add MONGODB_URL to secrets to use MongoDB Atlas.');
    return;
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Falling back to in-memory storage');
  }
}

export function isMongoConnected(): boolean {
  return !!mongoUrl && mongoose.connection.readyState === 1;
}

export { mongoose };