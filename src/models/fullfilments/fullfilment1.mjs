import mongoose from "mongoose";

const Fullfilment1Schema = new mongoose.Schema({
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

const Fullfilment1Model = mongoose.model('fullfilment-1', Fullfilment1Schema)

export default Fullfilment1Model;