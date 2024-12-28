import mongoose from 'mongoose';

const myModelForTgSchema = new mongoose.Schema({
  account: String,
  account_ru: String,
  num: Number,
  monako: String,
  fenix: String,
  lider: String,
  turan: String,
  liberty: String,
  fbox: String
});

const MyModelForTg = mongoose.model('telegramslots', myModelForTgSchema);

export default MyModelForTg;