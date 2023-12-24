import mongoose from "mongoose";

const Fullfilment1Schema = new mongoose.Schema({
    date: String,
    otchet: [{
        date: String,
        clients: String,
        services: Array,
        packages: Number,
        count_product: Number,
        status: String,
        expiration_date: String,
        sum_itog: Number,
        expenses: Number,
        sum_arrived: Number
    }]
})

const Fullfilment1Model = mongoose.model('fullfilment-1', Fullfilment1Schema)

export default Fullfilment1Model;