import simModelFenix from '../../models/simcard/simfenix.mjs';
import LiderDataModel from '../../models/lider/liderData.mjs';
import MonacoDataModel from '../../models/monaco/monacoData.mjs';
import FenixDataModel from '../../models/fenix/fenixData.mjs';
import TuranDataModel from '../../models/turan/turanData.mjs';

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [managers, dataItog, monacoItog, fenixItog, turanItog] = await Promise.all([
            simModelFenix.find(),
            LiderDataModel.find(),
            MonacoDataModel.find(),
            FenixDataModel.find(),
            TuranDataModel.find()
        ]);

        function isCurrentMonthAndYear(dateString) {
            const currentDate = new Date();
            const [day, month, year] = dateString.split('.').map(Number);
            return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
        }

        const filtereditog = dataItog.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogMonaco = monacoItog.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogFenix = fenixItog.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogTuran = turanItog.filter((item) => isCurrentMonthAndYear(item.date));

        const result = managers.map((elem) => {
            const nonEmptyBuyers = elem.slot.filter((item) => item.buyer !== '' && item.status === '2');

            if (nonEmptyBuyers.length > 0) {
                const adminDataItog = filtereditog.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommission = adminDataItog.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => acc2 + cur2.comPersent100, 0);
                }, 0);

                const totalOrders = adminDataItog.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);

                const adminDataItogMonaco = filtereditogMonaco.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommissionMonaco = adminDataItogMonaco.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => acc2 + cur2.comPersent100, 0);
                }, 0);

                const totalOrdersMonaco = adminDataItogMonaco.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);

                const adminDataItogFenix = filtereditogFenix.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommissionFenix = adminDataItogFenix.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => acc2 + cur2.comPersent100, 0);
                }, 0);

                const totalOrdersFenix = adminDataItogFenix.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);

                const adminDataItogTuran = filtereditogTuran.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommissionTuran = adminDataItogTuran.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => acc2 + cur2.comPersent100, 0);
                }, 0);

                const totalOrdersTuran = adminDataItogTuran.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);

                const totalComissionAll = totalCommission + totalCommissionMonaco + totalCommissionTuran + totalCommissionFenix;
                const coefficent = ((parseFloat(totalComissionAll) / parseFloat(nonEmptyBuyers.length).toFixed(0)).toFixed(0) / 1000).toFixed(1);
                const yourCommission = ((totalComissionAll) * 0.1).toFixed(0);
                const totalOrdersAll = totalOrders + totalOrdersMonaco + totalOrdersFenix + totalOrdersTuran;

                return {
                    curator: elem.curator,
                    buyerLength: nonEmptyBuyers.length,
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
