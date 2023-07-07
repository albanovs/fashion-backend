import mongoose from "mongoose";

const MonacoItogSchema = new mongoose.Schema({
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
    allItogPrihod: Number,
    allItogUhod: Number,
    raznica: Number,
    itogs: Number
});

const MonacoItogModel = mongoose.model("monacoitog", MonacoItogSchema);

export default MonacoItogModel;


