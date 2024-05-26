import mongoose from "mongoose";

const adminlogistRaitingSchema = new mongoose.Schema({
    datas: String,
    adminandlogist: Object,
})

const AdminLogistRaiting = mongoose.model('adminlogistraiting', adminlogistRaitingSchema)
export default AdminLogistRaiting