import mongoose from "mongoose";

const ClientsFenixSchema = new mongoose.Schema({
    clients: String,
    buyer_logist: String,
    date_to: String,
    date_go: String,
    summa: Number,
    order_count: Number,
    status: Boolean
})

const FenixClientsModel = mongoose.model('fenixclient', ClientsFenixSchema);

export default FenixClientsModel;