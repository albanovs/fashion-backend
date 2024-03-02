import mongoose from "mongoose";

const schetFacturaSchema = new mongoose.Schema({
    user_id: String,
    datas: String,
    manager: String,
    admin: String,
    status: String,
    FIO: String,
    city: String,
    bank: String,
    perevod: Number,
    valuta: String,
    curs: Number,
    position: Array
});

const schetfakturaModel = mongoose.model('schetfaktura', schetFacturaSchema);


export default schetfakturaModel;

