import mongoose from "mongoose";

const ModelRaitingManager = new mongoose.Schema({
    datas: String,
    managers: [{
        otdel: String,
        curator: String,
        data_register: String,
        buyerLength: Number,
        totalcom: Number,
        order: Number,
        comission: Number,
        comissionVM: Number,
        allCoeff: String,
        detail: Array,
        remainder: Number,
        for_withdrawal: [
            {
                summa: Number,
                date: Date,
            }
        ],
    }]
}, { strict: false });

const ModelManagerRaiting = mongoose.model('managerraitings', ModelRaitingManager);

export default ModelManagerRaiting;