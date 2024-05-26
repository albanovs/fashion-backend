import mongoose from "mongoose";

const adminlogistRaitingSchema = new mongoose.Schema({
    datas: String,
    st_admins: Array,
})

const StAdminRaiting = mongoose.model('stadminraiting', adminlogistRaitingSchema)
export default StAdminRaiting