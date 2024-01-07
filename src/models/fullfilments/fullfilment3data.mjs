import mongoose from "mongoose";

const Fullfilment3DataSchema = new mongoose.Schema({
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

const Fullfilment3dataModel = mongoose.model('fullfilment-3-data', Fullfilment3DataSchema)

export default Fullfilment3dataModel;