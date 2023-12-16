import mongoose from "mongoose";

const Fullfilment5Schema = new mongoose.Schema({
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

const Fullfilment5Model = mongoose.model('fullfilment-5', Fullfilment5Schema)

export default Fullfilment5Model;