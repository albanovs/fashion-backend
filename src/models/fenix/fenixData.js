import mongoose from "mongoose";

const FenixDataSchema = new mongoose.Schema({
    date: String,
    otchet: [{
        _id: String,
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
        itogIndex: Number,
    }],
    itog: [{
        _id: String,
        date: Date,
        ros1: String,
        ros2: String,
        ros3: String,
        ros4: String,
        ros5: String,
        ros6: String,
        ros7: String,
        sum1: Number,
        sum2: Number,
        sum3: Number,
        sum4: Number,
        sum5: Number,
        sum6: Number,
        sum7: Number,
        upak: Number,
        allItogIndex: Number,
        allItog: Number,
        allItogUhod: Number,
        allItogPrihod: Number,
        raznica: Number,
        itogs: Number
    }]
});

const FenixDataModel = mongoose.model('fenixdata', FenixDataSchema);


export default FenixDataModel;