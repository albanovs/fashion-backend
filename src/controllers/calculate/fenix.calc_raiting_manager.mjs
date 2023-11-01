import simModelFenix from '../../models/simcard/simfenix.mjs';
import LiderDataModel from '../../models/lider/liderData.mjs';
import MonacoDataModel from '../../models/monaco/monacoData.mjs';
import FenixDataModel from '../../models/fenix/fenixData.mjs';
import TuranDataModel from '../../models/turan/turanData.mjs';

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [managers, fenixItog] = await Promise.all([
            simModelFenix.find(),
            FenixDataModel.find(),
        ]);

        function isCurrentMonthAndYear(dateString) {
            const currentDate = new Date();
            const [day, month, year] = dateString.split('.').map(Number);
            return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
        }

        const filtereditogFenix = fenixItog.filter((item) => isCurrentMonthAndYear(item.date));

        const result = managers.map((elem) => {
            const nonEmptyBuyers = elem.slot.filter((item) => item.buyer !== '' && item.status === '2');

            if (nonEmptyBuyers.length > 0) {

                const adminDataItogFenix = filtereditogFenix.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommissionFenix = adminDataItogFenix.reduce((acc, cur) => {
                    const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
                        if (cur2.buyer === elem.curator || nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer)) {
                            return acc2 + cur2.comPersent100;
                        }
                        return acc2;
                    }, 0);
                    return acc + curatorCommission;
                }, 0);

                const totalOrdersFenix = adminDataItogFenix.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);

                const coefficent = ((parseFloat(totalCommissionFenix) / parseFloat(nonEmptyBuyers.length).toFixed(0)).toFixed(0) / 1000).toFixed(1);
                const yourCommission = ((totalCommissionFenix) * 0.1).toFixed(0);

                return {
                    curator: elem.curator,
                    buyerLength: nonEmptyBuyers.length,
                    totalcom: totalCommissionFenix,
                    order: totalOrdersFenix,
                    coeff: coefficent,
                    comission: yourCommission,
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
    if (!cachedData) {
        const result = await calculateAndCacheData();
        cachedData = result;
        console.log('Данные вычислены и закешированы.');
    }
}

calculateAndCacheDataCash();

const cacheUpdateInterval = 600000;
setInterval(async () => {
    try {
        const result = await calculateAndCacheData();
        cachedData = result;
        console.log('Данные вычислены и закешированы.');
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}, cacheUpdateInterval);

const calcRaintingManagerFenix = async (req, res) => {
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

export default { calcRaintingManagerFenix };
