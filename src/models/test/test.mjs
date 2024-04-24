import mongoose from "mongoose";

const TestModel = new mongoose.Schema({
    username: String,
    descripiton: String
})

const Test = mongoose.model('test', TestModel);

export default Test;
