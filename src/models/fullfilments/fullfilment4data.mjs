import mongoose from "mongoose";

const Fullfilment4DataSchema = new mongoose.Schema({
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

const Fullfilment4dataModel = mongoose.model('fullfilment-4-data', Fullfilment4DataSchema)

export default Fullfilment4dataModel;