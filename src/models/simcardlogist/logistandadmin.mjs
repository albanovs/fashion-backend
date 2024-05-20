import mongoose from "mongoose";

const ModelLogistAndAdmin = new mongoose.Schema({
    team: String,
    select: String,
    slot: [{
        num: Number,
        number: String,
        status: String,
        logist: String,
        personal_number: String,
        date_of_verification: String,
        days_since_verification: String,
        status_simCard: String,
        physical_simCard: String,
        registration: String,
        WAcod: String,
        TGcod: String,
    }]
}, { strict: false });

const LogistAndAdmin = mongoose.model('logistandadmin', ModelLogistAndAdmin);

export default LogistAndAdmin;
