import fenixOtchetBetaModel from "../../models/fenix/fenixOtchetBeta.mjs";


const createOtchet = async (req, res) => {
    try {
        const otchetArray = [];
        for (let i = 1; i <= 30; i++) {
            otchetArray.push({
                list: i,
                sm: 1,
                sity: '',
                admin: '',
                buyer: '',
                comPersent100: 0,
                comPersent2: 0,
                comPersent3: 0,
                comPersent4: 0,
                indexPersent100: 0,
                indexPersent2: 0,
                indexPersent3: 0,
                indexPersent4: 0,
                uhod: 0,
                prihod: 0,
                itog: 0,
                itogIndex: 0
            });
        }

        const newotchet = new fenixOtchetBetaModel({
            otchet: otchetArray,
            itog: [{
                ros1: '',
                ros2: '',
                ros3: '',
                ros4: '',
                ros5: '',
                sum1: 0,
                sum2: 0,
                sum3: 0,
                sum4: 0,
                sum5: 0,
                allItogIndex: 0,
                allItog: 0,
                allItogPrihod: 0,
                allItogUhod: 0,
                raznica: 0,
                itogs: 0
            }]
        });

        await newotchet.save();

        res.status(201).json({ message: 'Отчеты успешно созданы' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Что-то пошло не так" });
    }
}

const updateOtchet = async (req, res) => {
    const { id } = req.params;
    const {
        sm,
        sity,
        admin,
        buyer,
        comPersent100,
        comPersent2,
        comPersent3,
        comPersent4,
        indexPersent100,
        indexPersent2,
        indexPersent3,
        indexPersent4,
        uhod,
        prihod,
        itog,
        itogIndex,
        ros1,
        ros2,
        ros3,
        ros4,
        ros5,
        sum1,
        sum2,
        sum3,
        sum4,
        sum5,
        allItogIndex,
        allItog,
        allItogPrihod,
        allItogUhod,
        raznica,
        itogs
    } = req.body;

    try {
        const updatedDoc = await fenixOtchetBetaModel.findOneAndUpdate(
            { "otchet._id": id },
            {
                "otchet.$.sm": sm,
                "otchet.$.sity": sity,
                "otchet.$.admin": admin,
                "otchet.$.buyer": buyer,
                "otchet.$.comPersent100": comPersent100,
                "otchet.$.comPersent2": comPersent2,
                "otchet.$.comPersent3": comPersent3,
                "otchet.$.comPersent4": comPersent4,
                "otchet.$.indexPersent100": indexPersent100,
                "otchet.$.indexPersent2": indexPersent2,
                "otchet.$.indexPersent3": indexPersent3,
                "otchet.$.indexPersent4": indexPersent4,
                "otchet.$.uhod": uhod,
                "otchet.$.prihod": prihod,
                "otchet.$.itog": itog,
                "otchet.$.itogIndex": itogIndex,
                "otchet.$.itog.ros1": ros1,
                "otchet.$.itog.ros2": ros2,
                "otchet.$.itog.ros3": ros3,
                "otchet.$.itog.ros4": ros4,
                "otchet.$.itog.ros5": ros5,
                "otchet.$.itog.sum1": sum1,
                "otchet.$.itog.sum2": sum2,
                "otchet.$.itog.sum3": sum3,
                "otchet.$.itog.sum4": sum4,
                "otchet.$.itog.sum5": sum5,
                "otchet.$.itog.allItogIndex": allItogIndex,
                "otchet.$.itog.allItog": allItog,
                "otchet.$.itog.allItogPrihod": allItogPrihod,
                "otchet.$.itog.allItogUhod": allItogUhod,
                "otchet.$.itog.raznica": raznica,
                "otchet.$.itog.itogs": itogs
            },
            { new: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({ error: 'Элемент не найден' });
        }

        res.json(updatedDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
}

const updateItog = async (req, res) => {
    const { id } = req.params;
    const {
        ros1,
        ros2,
        ros3,
        ros4,
        ros5,
        sum1,
        sum2,
        sum3,
        sum4,
        sum5,
        allItogIndex,
        allItog,
        allItogPrihod,
        allItogUhod,
        raznica,
        itogs
    } = req.body;

    try {
        const updatedDoc = await fenixOtchetBetaModel.findOneAndUpdate(
            { "itog._id": id },
            {
                "itog.$.ros1": ros1,
                "itog.$.ros2": ros2,
                "itog.$.ros3": ros3,
                "itog.$.ros4": ros4,
                "itog.$.ros5": ros5,
                "itog.$.sum1": sum1,
                "itog.$.sum2": sum2,
                "itog.$.sum3": sum3,
                "itog.$.sum4": sum4,
                "itog.$.sum5": sum5,
                "itog.$.allItogIndex": allItogIndex,
                "itog.$.allItog": allItog,
                "itog.$.allItogPrihod": allItogPrihod,
                "itog.$.allItogUhod": allItogUhod,
                "itog.$.raznica": raznica,
                "itog.$.itogs": itogs
            },
            { new: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({ error: 'Элемент не найден' });
        }
        res.json(updatedDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
}

const getOtchetBeta = async (req, res) => {
    try {
        const data = await fenixOtchetBetaModel.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const deleteOtchetBeta = async (req, res) => {
    try {
        await fenixOtchetBetaModel.deleteMany();
        res.status(200).json({ message: 'Коллекция успешно удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка при удалении коллекции' });
    }
}

const addSlotOtchet = async (req, res) => {
    try {
        const { id } = req.body;

        const newData = await fenixOtchetBetaModel.findByIdAndUpdate(
            id,
            {
                $push: {
                    otchet: [{
                        list: 1,
                        sm: 1,
                        sity: '',
                        admin: '',
                        buyer: '',
                        comPersent100: 0,
                        comPersent2: 0,
                        comPersent3: 0,
                        comPersent4: 0,
                        indexPersent100: 0,
                        indexPersent2: 0,
                        indexPersent3: 0,
                        indexPersent4: 0,
                        uhod: 0,
                        prihod: 0,
                        itog: 0,
                        itogIndex: 0
                    }]
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

export default { createOtchet, updateOtchet, updateItog, getOtchetBeta, deleteOtchetBeta, addSlotOtchet }