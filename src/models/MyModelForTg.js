import mongoose from 'mongoose';

const myModelForTgSchema = new mongoose.Schema({
  account: String,
  num: Number,
  monako: String,
  fenix: String,
  lider: String,
  turan: String,
});

const MyModelForTg = mongoose.model('telegramslots', myModelForTgSchema);

export default MyModelForTg;