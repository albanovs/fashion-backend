import FenixDataModel from "../../models/fenix/fenixData.mjs";
import { createUniversalData } from "../global-utils/otchet.mjs";
import fenixOtchetController from "./fenixOtchetController.mjs";


// const createFenixData = async (req, res) => {
//     const { date, otchet, itog } = req.body;

//     try {
//         let data = {
//             date: date,
//             otchet: otchet.map(elem => ({
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
//                 itogIndex: elem.itogIndex
//             })),
//             itog: itog.map(elem => ({
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
//                 itogs: elem.itogs
//             }))
//         };

//         const currentDate = new Date().toISOString().slice(0, 7);
//         const FenixManagers = await ModelManagerRaiting.find({ datas: currentDate });
//         let SelectedManagers = FenixManagers.map(elem => elem.managers).flat().filter((elem) => elem.otdel === "Ильяс");

//         for (let manager of SelectedManagers) {
//             let totalOrdersForCurator = 0;
//             let totalOrdersForDetails = 0;
//             let totalSumForCurator = 0;
//             let totalSumForDetails = 0;
//             let totalComPersent100ForDetails = 0;

//             const curatorOrders = data.otchet.filter(otchet =>
//                 otchet.buyer.replace(/\s/g, '').toLowerCase() === manager.curator.replace(/\s/g, '').toLowerCase()
//             );

//             totalOrdersForCurator = curatorOrders.length;
//             totalSumForCurator = curatorOrders.reduce((sum, report) => sum + report.itog, 0);

//             manager.detail = manager.detail.map(detail => {
//                 const matchingOrders = data.otchet.filter(otchet =>
//                     otchet.buyer.replace(/\s/g, '').toLowerCase() === detail.name.replace(/\s/g, '').toLowerCase()
//                 );

//                 if (matchingOrders.length > 0) {
//                     const totalMatchingSum = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
//                     totalOrdersForDetails += matchingOrders.length;
//                     totalSumForDetails += totalMatchingSum;

//                     detail.summa = (detail.summa || 0) + totalMatchingSum;
//                     detail.orders = (detail.orders || 0) + matchingOrders.length;

//                     const comPersent100Sum = matchingOrders.reduce((sum, report) => sum + report.comPersent100, 0);
//                     totalComPersent100ForDetails += comPersent100Sum;
//                 }

//                 return detail;
//             });

//             if (totalOrdersForCurator > 0) {
//                 manager.order = (manager.order || 0) + totalOrdersForCurator;
//                 manager.totalcom = (manager.totalcom || 0) + totalSumForCurator;
//             }

//             if (totalOrdersForDetails > 0) {
//                 manager.order = (manager.order || 0) + totalOrdersForDetails;
//                 manager.totalcom = (manager.totalcom || 0) + totalSumForDetails;
//             }

//             manager.comission = parseFloat((manager.comission || 0)) + Math.round(totalComPersent100ForDetails * 0.07)
//             manager.comissionVM = manager.curator.includes('ВМ') ? 0 : parseFloat((manager.comissionVM || 0)) + Math.round(totalComPersent100ForDetails * 0.03)
//             manager.allCoeff = (parseFloat((manager.allCoeff || 0)) + (parseFloat((totalOrdersForCurator + totalOrdersForDetails)) / manager.buyerLength) + parseFloat((totalComPersent100ForDetails / manager.buyerLength)) / 1000).toFixed(1)

//             await ModelManagerRaiting.updateOne(
//                 { 'managers._id': manager._id },
//                 {
//                     $set: {
//                         'managers.$.detail': manager.detail,
//                         'managers.$.totalcom': manager.totalcom,
//                         'managers.$.order': manager.order,
//                         'managers.$.comission': manager.comission,
//                         'managers.$.comissionVM': manager.comissionVM,
//                         'managers.$.allCoeff': manager.allCoeff
//                     }
//                 }
//             );
//         }
//         const fenixData = new FenixDataModel(data);
//         await fenixData.save()
//         await fenixOtchetController.deleteOtchetBeta(req, res);
//         await fenixOtchetController.createOtchet(req, res);
//     } catch (error) {
//         console.error('Ошибка при сохранении данных:', error);
//         res.status(500).send('Ошибка при сохранении данных');
//     }
// };

export const createFenixData = async (req, res) => {
    try {
        await createUniversalData(req, res, FenixDataModel, fenixOtchetController, "Ильяс");
    } catch (error) {
        res.status(500).json({ message: "Ошибка при создании данных для другой модели" });
    }
};

const getFenixData = async (req, res) => {
    try {
        const data = await FenixDataModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const updateFenixData = async (req, res) => {
    const { id } = req.params
    const { buyer } = req.body

    try {
        const updateDoc = await FenixDataModel.findOneAndUpdate(
            { "otchet._id": id },
            {
                "otchet.$.buyer": buyer,
            },
            { new: true }
        )

        if (!updateDoc) {
            return res.status(404).json({ error: 'Элемент не найден' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
}

export default { createFenixData, getFenixData, updateFenixData }