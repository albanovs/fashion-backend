import mongoose from "mongoose";

const Fullfilment1DataSchema = new mongoose.Schema({
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

const Fullfilment1dataModel = mongoose.model('fullfilment-1-data', Fullfilment1DataSchema)

export default Fullfilment1dataModel;