import mongoose from "mongoose";

const ManagerPersentSchema = new mongoose.Schema({
    datas: String,
    manager: String,
    persent: Array
})

const ManagerPersent = mongoose.model('managerpersent', ManagerPersentSchema)
export default ManagerPersent