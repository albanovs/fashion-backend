import mongoose from "mongoose";

const ModelLiderSchema = new mongoose.Schema({
    data_register: String,
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
        data_register: String,
    }]
}, { strict: false });

const SimModelLider = mongoose.model('simCardLider', ModelLiderSchema);

export default SimModelLider;
