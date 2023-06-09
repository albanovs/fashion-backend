import mongoose from 'mongoose';

export const connect = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://albvnovs:wsxokn890@cluster0.tovrrlk.mongodb.net/?retryWrites=true&w=majority'
    );
    console.log('DB connected');
  } catch (error) {
    console.error('DB connection error', error);
  }
};