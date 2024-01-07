import mongoose from "mongoose";

const Fullfilment3Schema = new mongoose.Schema({
    date: String,
    last_date: String,
    otchet: [{
        date: String,
        clients: String,
        services: Array,
        packages: Number,
        count_product: Number,
        status: String,
        expiration_date: String,
        sale: String,
        sum_itog: Number,
        expenses: Number,
        sum_arrived: Number
    }]
})

const Fullfilment3Model = mongoose.model('fullfilment-3', Fullfilment3Schema)

export default Fullfilment3Model;