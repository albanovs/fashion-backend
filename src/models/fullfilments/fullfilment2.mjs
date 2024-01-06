import mongoose from "mongoose";

const Fullfilment2Schema = new mongoose.Schema({
    date: String,
    otchet: [{
        date: String,
        clients: String,
        services: String,
        packages: String,
        count_product: String,
        status: String,
        expiration_date: String,
        sale: String,
        sum_itog: String,
        expenses: String,
        sum_arrived: String
    }]
})

const Fullfilment2Model = mongoose.model('fullfilment-2', Fullfilment2Schema)

export default Fullfilment2Model;