import Fullfilment1Model from "../../models/fullfilments/fullfilment1.mjs"

const createFullfilmentTable = async (req, res) => {
    try {
        const { date } = req.body;

        const otchetArray = Array.from({ length: 30 }, () => ({
            date: '',
            clients: '',
            services: [],
            packages: '',
            count_product: '',
            status: '',
            expiration_date: '',
            sum_itog: '',
            expenses: '',
            sum_arrived: ''
        }));

        const newData = new Fullfilment1Model({
            date: date,
            otchet: otchetArray
        });

        await newData.save();
        res.status(200).json({ message: JSON.stringify(newData) });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error) });
    }
};


const addFullfilmentSlot = async (req, res) => {
    try {
        const { id } = req.body;

        const newData = await Fullfilment1Model.findByIdAndUpdate(
            id,
            {
                $push: {
                    otchet: {
                        date: '',
                        clients: '',
                        services: [],
                        packages: '',
                        count_product: '',
                        status: '',
                        expiration_date: '',
                        sum_itog: '',
                        expenses: '',
                        sum_arrived: ''
                    }
                }
            },
            { new: true }
        );

        res.status(200).json({ newData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to insert new slot" });
    }
}

const editFullfilmentTable = async (req, res) => {
    const { id } = req.params;
    const {
        date,
        clients,
        services,
        packages,
        count_product,
        status,
        expiration_date,
        sum_itog,
        expenses,
        sum_arrived,
    } = req.body
    try {
        const updateFullfilment = await Fullfilment1Model.findOneAndUpdate(
            { "otchet._id": id },
            {
                "otchet.$.date": date,
                "otchet.$.clients": clients,
                "otchet.$.services": services,
                "otchet.$.packages": packages,
                "otchet.$.count_product": count_product,
                "otchet.$.status": status,
                "otchet.$.expiration_date": expiration_date,
                "otchet.$.sum_itog": sum_itog,
                "otchet.$.expenses": expenses,
                "otchet.$.sum_arrived": sum_arrived,
            },
            { new: true }
        )
        res.json(updateFullfilment);
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getFullfilmentTable = async (req, res) => {
    try {
        const data = await Fullfilment1Model.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const deleteSlot = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedfullfilment = await Fullfilment1Model.findOneAndUpdate(
            { "otchet._id": id },
            { $pull: { otchet: { _id: id } } },
            { new: true }
        );
        res.json(updatedfullfilment);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так при удалении слота",
        });
    }
};

export default { createFullfilmentTable, addFullfilmentSlot, editFullfilmentTable, getFullfilmentTable, deleteSlot }