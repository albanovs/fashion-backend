import mongoose from "mongoose";

const ModelRolesSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String
   
}, { strict: false });

const ModelRoles = mongoose.model('practic', ModelRolesSchema);

export default ModelRoles;
