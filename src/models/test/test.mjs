import mongoose from "mongoose";

const TestModel = new mongoose.Schema({
    username: String,
    descripton: String
})

const Test = mongoose.model('test', TestModel);

export default Test;
