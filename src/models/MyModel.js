import mongoose from 'mongoose';

const myModelSchema = new mongoose.Schema({
    account: String,
    num: Number,
    monako: String,
    fenix: String,
    lider: String,
    turan: String
})

const MyModel = mongoose.model('mymodels', myModelSchema);

export default MyModel;