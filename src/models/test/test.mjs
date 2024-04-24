import mongoose from "mongoose";

const TestModel = new mongoose.Schema({
    username: String,
    description: String
})

const Test = mongoose.model('test', TestModel);

export default Test;
