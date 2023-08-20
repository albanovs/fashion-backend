import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    password: String,
    team: String,
    role: String
});

const UserForTeam = mongoose.model('loginforteam', userSchema);

export default UserForTeam;