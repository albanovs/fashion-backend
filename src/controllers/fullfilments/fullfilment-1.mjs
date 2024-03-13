import Fullfilment1Model from "../../models/fullfilments/fullfilment1.mjs"
import Fullfilment1dataModel from "../../models/fullfilments/fullfilment1data.mjs";
import cron from 'node-cron'

const createFullfilmentTable = async (req, res) => {
    try {
        const { date } = req.body;

        const otchetArray = Array.from({ length: 30 }, () => ({
            date: '',
            clients: '',
            services: [],
            packages: '',
            count_product: '',
            sum_itog: '',
            expenses: '',
            sum_arrived: ''
        }));

        const newData = new Fullfilment1Model({
            date: date,
            otchet: otchetArray,
            itogs: {
                all_expenses: 0,
                itog100: 0
            }
        });

        await newData.save();
        res.status(200).json({ message: JSON.stringify(newData) });
    } catch (error) {
        res.status(500).json({ message: JSON.stringify(error) });
    }
};


const addFullfilmentSlot = async (req, res) => {
    try {
        const { id } = req.params;

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

const updateResult = async (req, res) => {
    const { id } = req.params;
    const { all_expenses, itog100 } = req.body;

    try {
        const updatedDocument = await Fullfilment1Model.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    "itogs.all_expenses": all_expenses,
                    "itogs.itog100": itog100
                }
            },
            { new: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({ error: "Документ для обновления itogs не найден" });
        }

        res.json(updatedDocument);
    } catch (error) {
        console.error('Ошибка при обновлении itogs:', error);
        res.status(500).json({
            error: "Что-то пошло не так при обновлении itogs",
        });
    }
};


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

const deleteOtchet = async (req, res) => {
    const { id } = req.params
    try {
        const deletedOtchet = await Fullfilment1Model.findByIdAndDelete(id);
        if (!deletedOtchet) {
            return res.status(404).json({ error: "Отчет для удаления не найден" });
        }
        res.json({ message: "Отчет успешно удален" });
    } catch (error) {
        res.status(500).json({ error: "Что-то пошло не так при удалении отчета" });
    }
}


const checkAndMoveDocuments = async (req, res) => {
    try {
        const documentsToMove = await Fullfilment1Model.find();

        if (documentsToMove && documentsToMove.length > 0) {
            const filteredDocuments = documentsToMove.filter(doc =>
                doc.otchet.some(item => item.clients !== "" && item.sum_itog !== null)
            );

            if (filteredDocuments.length > 0) {
                await Fullfilment1dataModel.insertMany(filteredDocuments);
                await Fullfilment1Model.deleteMany({ _id: { $in: filteredDocuments.map(doc => doc._id) } });
            } else {
                console.log('Документов для переноса с заполненными ключами clients и sum_itog не найдено.');
            }
        } else {
            console.log('Документов для переноса не найдено для сегодняшней даты.');
        }
    } catch (error) {
        console.error('Ошибка при переносе документов:', error);
        res.status(500).json({ error: "Ошибка при переносе документов" });
    }
};



const getSuccesData = async (req, res) => {
    try {
        const data = await Fullfilment1dataModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

export default {
    createFullfilmentTable, addFullfilmentSlot,
    editFullfilmentTable, getFullfilmentTable,
    deleteOtchet, getSuccesData, checkAndMoveDocuments, updateResult
}