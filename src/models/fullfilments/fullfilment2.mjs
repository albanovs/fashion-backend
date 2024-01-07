import mongoose from "mongoose";

const Fullfilment2Schema = new mongoose.Schema({
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

const Fullfilment2Model = mongoose.model('fullfilment-2', Fullfilment2Schema)

export default Fullfilment2Model;