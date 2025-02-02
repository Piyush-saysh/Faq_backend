import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        throw new Error('❌ MongoDB Connection Failed', error);
    }
};

export default connectDB;
