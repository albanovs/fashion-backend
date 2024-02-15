import simMonacoLog from '../../models/simcardlogist/monacologist.mjs';
import MonacoDataModel from '../../models/monaco/monacoData.mjs';
import { filterAdminDataItog, calculateTotalCommission, calculateTotalOrders, isCurrentMonthAndYear } from './utils/utils.mjs'
import { calculateMatchesCurator, calculateMatchesLogist, calculateSumComPersent100 } from './utils/detail-logist.mjs'
import cron from 'node-cron'

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [logist, dataItog] = await Promise.all([
            simMonacoLog.find(),
            MonacoDataModel.find(),
        ]);

        const filtereditog = dataItog.filter((item) => isCurrentMonthAndYear(item.date));

        const result = logist.map((elem) => {
            const nonEmptyLogist = elem.slot.filter((item) => item.logist !== '' && item.status === '2');

            if (nonEmptyLogist.length > 0) {

                const adminDataItog = filterAdminDataItog(filtereditog, nonEmptyLogist, elem);
                const totalCommission = calculateTotalCommission(filtereditog, elem, nonEmptyLogist);
                const totalOrders = calculateTotalOrders(filtereditog, elem, nonEmptyLogist);

                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyLogist.length).toFixed(0)).toFixed(0) / 10000).toFixed(1);
                const yourCommission = ((totalCommission) * 0.15).toFixed(0);
                const totalOrdersAll = totalOrders;

                const detailInfo = nonEmptyLogist.map(logistItem => {

                    const matchesCurator = calculateMatchesCurator(filtereditog, elem);
                    const matchesLogist = calculateMatchesLogist(filtereditog, logistItem);
                    const sumComPersent100 = calculateSumComPersent100(filtereditog, logistItem);

                    return {
                        curator: matchesCurator,
                        name: logistItem.logist,
                        status: logistItem.status,
                        orders: matchesLogist,
                        summa: sumComPersent100 === 0 ? 0 : sumComPersent100,
                    };
                });


                return {
                    curator: elem.curator,
                    logistLength: nonEmptyLogist.length,
                    totalcom: totalCommission,
                    order: totalOrdersAll,
                    coeff: coefficent,
                    comission: yourCommission,
                    detail: detailInfo,
                };
            }

            return null;
        }).filter(Boolean);

        const totalComSum = result.reduce((sum, elem) => sum + elem.totalcom, 0);

        result.forEach((elem) => {
            elem.percentItog = ((elem.totalcom / totalComSum) * 100).toFixed(0);
        });

        return result;

    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

async function calculateAndCacheDataCash() {
    const result = await calculateAndCacheData();
    cachedData = result;
}

calculateAndCacheDataCash();

cron.schedule('*/10 * * * *', async () => {
    try {
        await calculateAndCacheDataCash();
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
});

const calcRaintingLogist = async (req, res) => {
    try {
        if (!cachedData) {
            await calculateAndCacheData();
        }
        res.json(cachedData);
        // const resq = await calculateAndCacheData()
        // res.json(resq);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

simMonacoLog.on("change", calculateAndCacheDataCash)
MonacoDataModel.on("change", calculateAndCacheDataCash)

export default { calcRaintingLogist };
