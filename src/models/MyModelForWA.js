import mongoose from 'mongoose';

const MyModelForWASchema = new mongoose.Schema({
    account: String,
    num: Number,
    monako: String,
    fenix: String,
    lider: String,
    turan: String
})

const MyModelForWA = mongoose.model('whatsappslots', MyModelForWASchema);

export default MyModelForWA;