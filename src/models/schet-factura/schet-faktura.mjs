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
    ostatok: Number,
    budjet: Number,
    position: Array,
    balans: Number,
    all_sum: Number,
    upakovka: Number,
    dostavka: Number,
    comission: Number,
    itogs: Number

});

const schetfakturaModel = mongoose.model('schetfaktura', schetFacturaSchema);


export default schetfakturaModel;

