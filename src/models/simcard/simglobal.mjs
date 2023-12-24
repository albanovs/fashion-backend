import mongoose from "mongoose";

const ModelGlobalSchema = new mongoose.Schema({
    curator: String,
    slot: [{
        num: Number,
        number: String,
        status: String,
        buyer: String,
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

const SimModelGlobal = mongoose.model('simCardGlobal', ModelGlobalSchema);

export default SimModelGlobal;
