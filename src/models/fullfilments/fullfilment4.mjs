import mongoose from "mongoose";

const Fullfilment4Schema = new mongoose.Schema({
    date: String,
    otchet: [{
        date: String,
        clients: String,
        services: String,
        packages: String,
        count_product: String,
        status: String,
        expiration_date: String,
        sum_itog: String,
        expenses: String,
        sum_arrived: String
    }]
})

const Fullfilment4Model = mongoose.model('fullfilment-4', Fullfilment4Schema)

export default Fullfilment4Model;