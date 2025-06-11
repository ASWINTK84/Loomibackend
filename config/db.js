import mongoose from 'mongoose';



const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI; 
    if (!mongoUri) {
        console.error("MONGO_URI environment variable is not set!");
        process.exit(1);
    }
    const conn = await mongoose.connect(mongoUri, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};



 export default connectDB;