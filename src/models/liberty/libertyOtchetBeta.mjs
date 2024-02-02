import mongoose from "mongoose";

const libertyOtchetBeta = new mongoose.Schema({
    otchet: [{
        list: Number,
        sm: Number,
        sity: String,
        admin: String,
        buyer: String,
        comPersent100: Number,
        comPersent2: Number,
        comPersent3: Number,
        comPersent4: Number,
        indexPersent100: Number,
        indexPersent2: Number,
        indexPersent3: Number,
        indexPersent4: Number,
        uhod: Number,
        prihod: Number,
        itog: Number,
        itogIndex: Number
    }],
    itog: [{
        ros1: String,
        ros2: String,
        ros3: String,
        ros4: String,
        ros5: String,
        sum1: Number,
        sum2: Number,
        sum3: Number,
        sum4: Number,
        sum5: Number,
        allItogIndex: Number,
        allItog: Number,
        allItogPrihod: Number,
        allItogUhod: Number,
        raznica: Number,
        itogs: Number
    }]
})

const libertyOtchetBetaModel = mongoose.model('libertyitogbeta', libertyOtchetBeta);
export default libertyOtchetBetaModel;