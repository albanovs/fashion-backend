import simTuranLog from '../../models/simcardlogist/turanlogist.mjs';
import TuranDataModel from '../../models/turan/turanData.mjs';

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [logist, turanItog] = await Promise.all([
            simTuranLog.find(),
            TuranDataModel.find()
        ]);

        function isCurrentMonthAndYear(dateString) {
            const currentDate = new Date();
            const [day, month, year] = dateString.split('.').map(Number);
            return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
        }

        const filtereditogTuran = turanItog.filter((item) => isCurrentMonthAndYear(item.date));

        const result = logist.map((elem) => {
            const nonEmptyLogist = elem.slot.filter((item) => item.logist !== '' && item.status === '2');

            if (nonEmptyLogist.length > 0) {

                const adminDataItogTuran = filtereditogTuran.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyLogist.some((logistItem) => {
                            return otchetItem.admin && (otchetItem.admin === logistItem.logist || otchetItem.admin === elem.curator);
                        });
                    });
                });

                const totalCommissionTuran = adminDataItogTuran.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => acc2 + cur2.comPersent100, 0);
                }, 0);

                const totalOrdersTuran = adminDataItogTuran.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.admin === elem.curator;
                        const matchesNonEmptyLogist = nonEmptyLogist.some((logistItem) => cur2.admin === logistItem.admin);
                        return acc2 + (matchesCurator || matchesNonEmptyLogist ? 1 : 0);
                    }, 0);
                }, 0);

                const totalComissionAll = totalCommissionTuran;
                const coefficent = ((parseFloat(totalComissionAll) / parseFloat(nonEmptyLogist.length).toFixed(0)).toFixed(0) / 10000).toFixed(1);
                const yourCommission = ((totalComissionAll) * 0.15).toFixed(0);
                const totalOrdersAll = totalOrdersTuran;

                return {
                    curator: elem.curator,
                    logistLength: nonEmptyLogist.length,
                    totalcom: totalComissionAll,
                    order: totalOrdersAll,
                    coeff: coefficent,
                    comission: yourCommission,
                };
            }

            return null;
        }).filter(Boolean);

        return result;

    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

async function calculateAndCacheDataCash() {
    if (!cachedData) {
        const result = await calculateAndCacheData();
        cachedData = result;
        console.log('Данные вычислены и закешированы.');
    }
}

calculateAndCacheDataCash();

const cacheUpdateInterval = 3600000; // 1 час
setInterval(() => {
    calculateAndCacheDataCash();
}, cacheUpdateInterval);

const calcRaintingLogist = async (req, res) => {
    try {
        if (!cachedData) {
            await calculateAndCacheData();
        }
        res.json(cachedData);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export default { calcRaintingLogist };
