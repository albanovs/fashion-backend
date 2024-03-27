import mongoose from "mongoose";

const Fullfilment1DataSchema = new mongoose.Schema({
    date: String,
    otchet: [{
        date: String,
        clients: String,
        services: Array,
        packages: Number,
        count_product: Number,
        sum_itog: Number,
        obslujival: Number,
        expenses: Number,
        sum_arrived: Number
    }],
    itogs: {
        all_expenses: Number,
        itog100: Number
    }

})

const Fullfilment1dataModel = mongoose.model('fullfilment-1-data', Fullfilment1DataSchema)

export default Fullfilment1dataModel;