import mongoose from "mongoose";

const ClientsTuranSchema = new mongoose.Schema({
    clients: String,
    buyer_logist: String,
    date_to: String,
    date_go: String,
    summa: Number,
    order_count: Number
})

const TuranClientsModel = mongoose.model('turanclient', ClientsTuranSchema);

export default TuranClientsModel;