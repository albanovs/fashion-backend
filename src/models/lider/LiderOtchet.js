import mongoose from "mongoose";

const LiderOtchet = new mongoose.Schema({
    list: Number,
    sm: Number,
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
});


const LiderModel = mongoose.model("liderotchet", LiderOtchet);

export default LiderModel;
