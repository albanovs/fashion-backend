import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('logins', userSchema);

export default User;