import mongoose from 'mongoose';

const userSchemaTeam = new mongoose.Schema({
    fullName: String,
    username: String,
    password: String,
    team: String,
    role: String
});

const UserForTeam = mongoose.model('loginforteam', userSchemaTeam);

export default UserForTeam;