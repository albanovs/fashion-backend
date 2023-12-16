import mongoose from "mongoose";

const Fullfilment3Schema = new mongoose.Schema({
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

const Fullfilment3Model = mongoose.model('fullfilment-3', Fullfilment3Schema)

export default Fullfilment3Model;