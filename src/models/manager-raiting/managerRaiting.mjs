import mongoose from "mongoose";

const ManagerRaitingSchema = new mongoose.Schema({
    datas: String,
    managers: Array,
})

const ManagerRaiting = mongoose.model('managerRaiting', ManagerRaitingSchema)
export default ManagerRaiting