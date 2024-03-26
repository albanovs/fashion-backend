import mongoose from "mongoose";

const schetFacturaYntymakSchema = new mongoose.Schema({
    user_id: String,
    team: String,
    datas: String,
    manager: String,
    admin: String,
    status: String,
    FIO: String,
    city: String,
    bank: String,
    transfer: Array,
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

const schetfakturaYntymakModel = mongoose.model('schetfakturayntymak', schetFacturaYntymakSchema);

export default schetfakturaYntymakModel;