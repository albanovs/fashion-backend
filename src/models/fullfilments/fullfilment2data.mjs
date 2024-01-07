import mongoose from "mongoose";

const Fullfilment2DataSchema = new mongoose.Schema({
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

const Fullfilment2dataModel = mongoose.model('fullfilment-2-data', Fullfilment2DataSchema)

export default Fullfilment2dataModel;