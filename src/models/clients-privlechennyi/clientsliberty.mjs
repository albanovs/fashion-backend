import mongoose from "mongoose";

const ClientsLibertySchema = new mongoose.Schema({
    clients: String,
    buyer_logist: String,
    date_to: String,
    date_go: String,
    summa: Number,
    order_count: Number,
    status: Boolean
})

const LibertyClientsModel = mongoose.model('libertyclient', ClientsLibertySchema);

export default LibertyClientsModel;