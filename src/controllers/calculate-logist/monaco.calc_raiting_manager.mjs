import simMonacoLog from '../../models/simcardlogist/monacologist.mjs';
import MonacoDataModel from '../../models/monaco/monacoData.mjs';

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [logist, dataItog] = await Promise.all([
            simMonacoLog.find(),
            MonacoDataModel.find(),
        ]);

        function isCurrentMonthAndYear(dateString) {
            const currentDate = new Date();
            const [day, month, year] = dateString.split('.').map(Number);
            return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
        }

        const filtereditog = dataItog.filter((item) => isCurrentMonthAndYear(item.date));

        const result = logist.map((elem) => {
            const nonEmptyLogist = elem.slot.filter((item) => item.logist !== '' && item.status === '2');

            if (nonEmptyLogist.length > 0) {
                const adminDataItog = filtereditog.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyLogist.some((logistItem) => {
                            return otchetItem.admin && (otchetItem.admin === logistItem.logist || otchetItem.admin === elem.curator);
                        });
                    });
                });

                const totalCommission = adminDataItog.reduce((acc, cur) => {
                    const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
                        if (cur2.admin === elem.curator || nonEmptyLogist.some(logist => logist.logist === cur2.admin)) {
                            return acc2 + cur2.comPersent100;
                        }
                        return acc2;
                    }, 0);
                    return acc + curatorCommission;
                }, 0);



                const totalOrders = adminDataItog.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.admin === elem.curator;
                        const matchesNonEmptyLogist = nonEmptyLogist.some((logistItem) => cur2.admin === logistItem.logist);
                        return acc2 + (matchesCurator || matchesNonEmptyLogist ? 1 : 0);
                    }, 0);
                }, 0);

                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyLogist.length).toFixed(0)).toFixed(0) / 10000).toFixed(1);
                const yourCommission = ((totalCommission) * 0.15).toFixed(0);
                const totalOrdersAll = totalOrders;

                const detailInfo = nonEmptyLogist.map(logistItem => {
                    const matchesCurator = adminDataItog.some((itog) => {
                        return itog.otchet.some((otchetItem) => {
                            return otchetItem.admin === elem.curator;
                        });
                    });

                    const matchesLogist = adminDataItog.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.admin === logistItem.logist ? 1 : 0);
                        }, 0);
                    }, 0);

                    const sumComPersent100 = adminDataItog.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.admin === logistItem.logist ? cur2.comPersent100 : 0);
                        }, 0);
                    }, 0);

                    return {
                        name: logistItem.logist,
                        status: logistItem.status,
                        orders: matchesLogist,
                        summa: sumComPersent100,
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

        return result;

    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

async function calculateAndCacheDataCash() {
    if (!cachedData) {
        const result = await calculateAndCacheData();
        cachedData = result;
    }
}

calculateAndCacheDataCash();

const cacheUpdateInterval = 600000;
setInterval(async () => {
    try {
        const result = await calculateAndCacheData();
        cachedData = result;
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
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
