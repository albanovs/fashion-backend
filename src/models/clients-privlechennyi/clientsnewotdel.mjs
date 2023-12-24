import mongoose from "mongoose";

const ClientsnewOtdelSchema = new mongoose.Schema({
    clients: String,
    buyer_logist: String,
    date_to: String,
    date_go: String,
    summa: Number,
    order_count: Number,
    status: Boolean
})

const NewOtdelClientsModel = mongoose.model('newotdelclient', ClientsnewOtdelSchema);

export default NewOtdelClientsModel;