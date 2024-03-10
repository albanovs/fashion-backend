import LiderDataModel from "../../models/lider/liderData.mjs";

const createLiderData = async (req, res) => {
    const { date, otchet, itog } = req.body;

    try {
        const data = {
            date: date,
            otchet: otchet.map((elem) => ({
                _id: elem._id,
                sm: elem.sm,
                date: elem.date,
                sity: elem.sity,
                admin: elem.admin,
                buyer: elem.buyer,
                comPersent100: elem.comPersent100,
                comPersent2: elem.comPersent2,
                comPersent3: elem.comPersent3,
                comPersent4: elem.comPersent4,
                indexPersent100: elem.indexPersent100,
                indexPersent2: elem.indexPersent2,
                indexPersent3: elem.indexPersent3,
                indexPersent4: elem.indexPersent4,
                uhod: elem.uhod,
                prihod: elem.prihod,
                itog: elem.itog,
                itogIndex: elem.itogIndex,
            })),

            itog: itog.map((elem) => ({
                _id: elem._id,
                date: elem.date,
                ros1: elem.ros1,
                ros2: elem.ros2,
                ros3: elem.ros3,
                ros4: elem.ros4,
                ros5: elem.ros5,
                ros6: elem.ros6,
                ros7: elem.ros7,
                sum1: elem.sum1,
                sum2: elem.sum2,
                sum3: elem.sum3,
                sum4: elem.sum4,
                sum5: elem.sum5,
                sum6: elem.sum6,
                sum7: elem.sum7,
                upak: elem.upak,
                allItogIndex: elem.allItogIndex,
                allItog: elem.allItog,
                allItogUhod: elem.allItogUhod,
                allItogPrihod: elem.allItogPrihod,
                raznica: elem.raznica,
                itogs: elem.itogs,
            })),
        };

        const liderData = new LiderDataModel(data);
        await liderData.save();
        console.log('Данные успешно сохранены');
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.sendStatus(500);
    }
};

const updateLiderData = async (req, res) => {
    const { id } = req.params;
    const { buyer } = req.body;

    try {
        const updateDoc = await LiderDataModel.findOneAndUpdate(
            { "otchet._id": id },
            { "otchet.$.buyer": buyer },
            { new: true }
        );

        if (!updateDoc) {
            return res.status(404).json({ error: 'Элемент не найден' });
        }

        console.log('Данные успешно обновлены');
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
};

const getLiderData = async (req, res) => {
    try {
        const data = await LiderDataModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
}


export default { createLiderData, updateLiderData, getLiderData };
