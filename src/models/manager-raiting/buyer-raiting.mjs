import mongoose from "mongoose";

const BuyerRaitingSchema = new mongoose.Schema({
    datas: String,
    managers: Array,
})

const BuyerRaiting = mongoose.model('buyerRaiting', BuyerRaitingSchema)
export default BuyerRaiting