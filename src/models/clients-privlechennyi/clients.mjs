import mongoose, { mongo } from "mongoose";

const ClientsLeaderSchema = new mongoose.Schema({
    client: String,
    buyer_logist: String,
    date_to: String,
    date_go: String,
    summa: Number,
    order_count: Number
})

const LeaderClientsModel = mongoose.model('liderclient', ClientsLeaderSchema);

export default LeaderClientsModel;