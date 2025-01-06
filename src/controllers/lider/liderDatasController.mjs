import LiderDataModel from "../../models/lider/liderData.mjs";
import { createUniversalData } from "../global-utils/otchet.mjs";
import liderOtchetController from "./liderOtchetController.mjs";

// const createLiderData = async (req, res) => {
//     const { date, otchet, itog } = req.body;

//     try {
//         const data = {
//             date: date,
//             otchet: otchet.map((elem) => ({
//                 _id: elem._id,
//                 sm: elem.sm,
//                 date: elem.date,
//                 sity: elem.sity,
//                 admin: elem.admin,
//                 buyer: elem.buyer,
//                 comPersent100: elem.comPersent100,
//                 comPersent2: elem.comPersent2,
//                 comPersent3: elem.comPersent3,
//                 comPersent4: elem.comPersent4,
//                 indexPersent100: elem.indexPersent100,
//                 indexPersent2: elem.indexPersent2,
//                 indexPersent3: elem.indexPersent3,
//                 indexPersent4: elem.indexPersent4,
//                 uhod: elem.uhod,
//                 prihod: elem.prihod,
//                 itog: elem.itog,
//                 itogIndex: elem.itogIndex,
//             })),
//             itog: itog.map((elem) => ({
//                 _id: elem._id,
//                 date: elem.date,
//                 ros1: elem.ros1,
//                 ros2: elem.ros2,
//                 ros3: elem.ros3,
//                 ros4: elem.ros4,
//                 ros5: elem.ros5,
//                 ros6: elem.ros6,
//                 ros7: elem.ros7,
//                 sum1: elem.sum1,
//                 sum2: elem.sum2,
//                 sum3: elem.sum3,
//                 sum4: elem.sum4,
//                 sum5: elem.sum5,
//                 sum6: elem.sum6,
//                 sum7: elem.sum7,
//                 upak: elem.upak,
//                 allItogIndex: elem.allItogIndex,
//                 allItog: elem.allItog,
//                 allItogUhod: elem.allItogUhod,
//                 allItogPrihod: elem.allItogPrihod,
//                 raznica: elem.raznica,
//                 itogs: elem.itogs,
//             })),
//         };

//         const currentDate = new Date().toISOString().slice(0, 7);
//         const LeaderManagers = await ModelManagerRaiting.find({ datas: currentDate });
//         let SelectedManagers = LeaderManagers.map(elem => elem.managers).flat().filter((elem) => elem.otdel === "Лидер");

//         for (let manager of SelectedManagers) {
//             const totalCommission = calculateTotalCommissionBeta(data, manager, manager.detail);

//             manager.detail = manager.detail.map(detail => {
//                 const matchingReport = data.otchet.find(otchet =>
//                     otchet.buyer.replace(/\s/g, '').toLowerCase() === detail.name.replace(/\s/g, '').toLowerCase()
//                 );

//                 if (matchingReport) {
//                     detail.summa = (detail.summa || 0) + totalCommission;
//                 }
//                 return detail;
//             });

//             if (data.otchet.some(otchet =>
//                 otchet.buyer.replace(/\s/g, '').toLowerCase() === manager.curator.replace(/\s/g, '').toLowerCase())) {
//                 manager.totalcom = (manager.totalcom || 0) + totalCommission;
//             }

//             await ModelManagerRaiting.updateOne(
//                 { 'managers._id': manager._id },
//                 { $set: { 'managers.$.detail': manager.detail, 'managers.$.totalcom': manager.totalcom } }
//             );
//         }

//         const liderData = new LiderDataModel(data);
//         await liderData.save();
//         await liderOtchetController.deleteOtchetBeta(req, res);
//         await liderOtchetController.createOtchet(req, res);
//     } catch (error) {
//         console.error('Ошибка при сохранении данных:', error);
//         res.status(500).send('Ошибка при сохранении данных');
//     }
// };

export const createLiderData = async (req, res) => {
    try {
        await createUniversalData(req, res, LiderDataModel, liderOtchetController, "Кайрат");
    } catch (error) {
        res.status(500).json({ message: "Ошибка при создании данных для другой модели" });
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
        console.error("Ошибка в getLiderData:", error);
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};


export default { createLiderData, updateLiderData, getLiderData };
