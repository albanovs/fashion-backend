import mongoose from "mongoose";

const ClientsMonacoSchema = new mongoose.Schema({
    clients: String,
    buyer_logist: String,
    date_to: String,
    date_go: String,
    summa: Number,
    order_count: Number,
    status: Boolean
})

const MonacoClientsModel = mongoose.model('monacoclient', ClientsMonacoSchema);

export default MonacoClientsModel;