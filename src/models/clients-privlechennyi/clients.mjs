import mongoose from "mongoose";

const ClientsLeaderSchema = new mongoose.Schema({
    clients: String,
    buyer_logist: String,
    date_to: String,
    date_go: String,
    summa: Number,
    order_count: Number
})

const LeaderClientsModel = mongoose.model('liderclient', ClientsLeaderSchema);

export default LeaderClientsModel;