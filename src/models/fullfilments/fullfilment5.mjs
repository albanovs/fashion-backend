import mongoose from "mongoose";

const Fullfilment5Schema = new mongoose.Schema({
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

const Fullfilment5Model = mongoose.model('fullfilment-5', Fullfilment5Schema)

export default Fullfilment5Model;