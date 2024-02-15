import simNewOtdelLog from '../../models/simcardlogist/newotdellogist.mjs';
import NewOtdelDataModel from '../../models/new-otel/newOtdelData.mjs';
import { filterAdminDataItog, calculateTotalCommission, calculateTotalOrders, isCurrentMonthAndYear } from './utils/utils.mjs'
import { calculateMatchesCurator, calculateMatchesLogist, calculateSumComPersent100 } from './utils/detail-logist.mjs'
import cron from 'node-cron'

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [logist, dataItog] = await Promise.all([
            simNewOtdelLog.find(),
            NewOtdelDataModel.find(),
        ]);

        const filtereditog = dataItog.filter((item) => isCurrentMonthAndYear(item.date));

        const result = logist.map((elem) => {
            const nonEmptyLogist = elem.slot.filter((item) => item.logist !== '' && item.status === '2');

            if (nonEmptyLogist.length > 0) {

                const adminDataItog = filterAdminDataItog(filtereditog, nonEmptyLogist, elem);
                const totalCommission = calculateTotalCommission(adminDataItog, elem, nonEmptyLogist);
                const totalOrders = calculateTotalOrders(adminDataItog, elem, nonEmptyLogist);

                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyLogist.length).toFixed(0)).toFixed(0) / 10000).toFixed(1);
                const yourCommission = ((totalCommission) * 0.15).toFixed(0);

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
                    order: totalOrders,
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

const calcRaintingLogistNewOtdel = async (req, res) => {
    try {
        if (!cachedData) {
            await calculateAndCacheData();
        }
        // const request = await calculateAndCacheData()
        res.json(cachedData);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

simNewOtdelLog.on("change", calculateAndCacheDataCash)
NewOtdelDataModel.on("change", calculateAndCacheDataCash)

export default { calcRaintingLogistNewOtdel };
