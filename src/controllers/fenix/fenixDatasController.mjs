import FenixDataModel from "../../models/fenix/fenixData.mjs";
import fenixOtchetBetaModel from "../../models/fenix/fenixOtchetBeta.mjs";
import ModelManagerRaiting from "../../models/rainting/managerrainting/manager.mjs";


const createFenixData = async (req, res) => {
    const { date, otchet, itog } = req.body;
    try {
        const fenixData = new FenixDataModel({ date, otchet, itog });
        const otchetArray = Array.from({ length: 30 }, (_, i) => ({
            list: i + 1,
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
        }));

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

        const currentDate = new Date().toISOString().slice(0, 7);

        const FenixManagers = await ModelManagerRaiting.find({ datas: currentDate });

        const SelectedManagers = FenixManagers
            .flatMap(elem => elem.managers)
            .filter(manager => manager.otdel === "Ильяс");

        const updatePromises = SelectedManagers.map(async manager => {
            let totalOrdersForCurator = 0;
            let totalOrdersForDetails = 0;
            let totalSumForCurator = 0;
            let totalSumForDetails = 0;
            let totalComPersent100ForDetails = 0;

            const curatorOrders = otchet.filter(ot =>
                ot.buyer.replace(/\s/g, '').toLowerCase() === manager.curator.replace(/\s/g, '').toLowerCase()
            );
            totalOrdersForCurator = curatorOrders.length;
            totalSumForCurator = curatorOrders.reduce((sum, report) => sum + report.itog, 0);

            manager.detail = manager.detail.map(detail => {
                const matchingOrders = otchet.filter(ot =>
                    ot.buyer.replace(/\s/g, '').toLowerCase() === detail.name.replace(/\s/g, '').toLowerCase()
                );

                if (matchingOrders.length > 0) {
                    const totalMatchingSum = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                    totalOrdersForDetails += matchingOrders.length;
                    totalSumForDetails += totalMatchingSum;

                    detail.summa = (detail.summa || 0) + totalMatchingSum;
                    detail.orders = (detail.orders || 0) + matchingOrders.length;
                    detail.coeff = (
                        (parseFloat(detail.coeff) || 0) +
                        ((totalMatchingSum / matchingOrders.length) / 1000).toFixed(2)
                    );

                    const comPersent100Sum = matchingOrders.reduce((sum, report) => sum + report.comPersent100, 0);
                    totalComPersent100ForDetails += comPersent100Sum;
                }
                return detail;
            });

            if (totalOrdersForCurator > 0) {
                manager.order = (manager.order || 0) + totalOrdersForCurator;
                manager.totalcom = (manager.totalcom || 0) + totalSumForCurator;
            }

            if (totalOrdersForDetails > 0) {
                manager.order = (manager.order || 0) + totalOrdersForDetails;
                manager.totalcom = (manager.totalcom || 0) + totalSumForDetails;
            }

            manager.comission = parseFloat(manager.comission || 0) + Math.round(totalComPersent100ForDetails * 0.07);
            manager.remainder = parseFloat(manager.remainder || 0) + Math.round(totalComPersent100ForDetails * 0.07);

            manager.comissionVM = manager.curator.includes('ВМ')
                ? 0
                : parseFloat(manager.comissionVM || 0) + Math.round(totalComPersent100ForDetails * 0.03);

            manager.allCoeff = (
                parseFloat(manager.allCoeff || 0) +
                (totalOrdersForCurator + totalOrdersForDetails) / manager.buyerLength +
                (totalComPersent100ForDetails / manager.buyerLength) / 1000
            ).toFixed(1);

            await ModelManagerRaiting.updateOne(
                { 'managers._id': manager._id },
                {
                    $set: {
                        'managers.$.detail': manager.detail,
                        'managers.$.totalcom': manager.totalcom,
                        'managers.$.order': manager.order,
                        'managers.$.comission': manager.comission,
                        'managers.$.comissionVM': manager.comissionVM,
                        'managers.$.remainder': manager.remainder,
                        'managers.$.allCoeff': manager.allCoeff
                    }
                }
            );
        });

        await Promise.all(updatePromises);
        await fenixData.save();
        await fenixOtchetBetaModel.deleteMany();
        await newotchet.save();
        res.status(200).send('Данные успешно сохранены');
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error.message, error.stack);
        res.status(500).send('Ошибка при сохранении данных');
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