import mongoose from "mongoose";

const ModelManagerSchema = new mongoose.Schema({
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

const SimModelManager = mongoose.model('simCardManager', ModelManagerSchema);

export default SimModelManager;
