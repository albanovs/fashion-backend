import mongoose from "mongoose";

const schetFacturaSchema = new mongoose.Schema({
    manager: String,
    admin: String,
    status: String,
    FIO: String,
    city: String,
    bank: String,
});

const schetfakturaModel = mongoose.model('schetfaktura', schetFacturaSchema);


export default schetfakturaModel;

