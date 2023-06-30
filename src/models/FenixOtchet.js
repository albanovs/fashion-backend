import mongoose from "mongoose";

const FenixOtchet = new mongoose.Schema({
    list: Number,
    sm: Number,
    date: Date,
    sity: String,
    admin: String,
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
    Otpravka: Number,
    itog: Number,
    itogIndex: Number
})

const FenixModel = mongoose.model('fenixotchet', FenixOtchet)

export default FenixModel;