import mongoose from "mongoose";

const ModelRaitingManager = new mongoose.Schema({
    datas: String,
    managers: [{
        id_manager: String,
        otdel: String,
        curator: String,
        data_register: String,
        buyerLength: Number,
        totalcom: Number,
        order: Number,
        comission: Number,
        comissionVM: Number,
        allCoeff: String,
        detail: [
            {
                name: String,
                status: String,
                orders: Number,
                summa: Number,
                team: String,
                curator: String,
                coeff: Number,
                data_register: String
            }
        ],
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