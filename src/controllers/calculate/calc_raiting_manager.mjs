import simModelLier from '../../models/simcard/simlider.mjs';
import LiderDataModel from '../../models/lider/liderData.mjs';

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [managers, dataItog] = await Promise.all([
            simModelLier.find(),
            LiderDataModel.find(),
        ]);

        // function isCurrentMonthAndYear(dateString) {
        //     const currentDate = new Date();
        //     const [day, month, year] = dateString.split('.').map(Number);
        //     return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
        // }

        // const filtereditog = dataItog.filter((item) => isCurrentMonthAndYear(item.date));


        function isWithinLast30Days(dateString) {
            const currentDate = new Date();
            const targetDateParts = dateString.split('.');
            if (targetDateParts.length === 3) {
                const targetDate = new Date(
                    targetDateParts[2],   // Год
                    targetDateParts[1] - 1, // Месяц (в JavaScript месяцы начинаются с 0)
                    targetDateParts[0]    // День
                );
                const thirtyDaysAgo = new Date(currentDate);
                thirtyDaysAgo.setDate(currentDate.getDate() - 30);

                return targetDate >= thirtyDaysAgo && targetDate <= currentDate;
            }
            return false; // Возвращаем false, если формат даты неправильный
        }

        const filtereditog = dataItog.filter((item) => isWithinLast30Days(item.date));

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
                    const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
                        if (cur2.buyer === elem.curator || nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer)) {
                            return acc2 + cur2.comPersent100;
                        }
                        return acc2;
                    }, 0);
                    return acc + curatorCommission;
                }, 0);

                const totalOrders = adminDataItog.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);


                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyBuyers.length).toFixed(0)).toFixed(0) / 1000).toFixed(1);
                const yourCommission = ((totalCommission) * 0.1).toFixed(0);

                return {
                    curator: elem.curator,
                    buyerLength: nonEmptyBuyers.length,
                    totalcom: totalCommission,
                    order: totalOrders,
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

const calcRaintingManager = async (req, res) => {
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

let cachedData30day = null;

async function calculateAndCacheData30day() {
    try {
        const [managers, dataItog] = await Promise.all([
            simModelLier.find(),
            LiderDataModel.find(),
        ]);

        function isWithinLastMonth(dateString) {
            const currentDate = new Date();
            const targetDateParts = dateString.split('.');
            if (targetDateParts.length === 3) {
                const targetDate = new Date(
                    targetDateParts[2],   // Год
                    targetDateParts[1] - 1, // Месяц (в JavaScript месяцы начинаются с 0)
                    targetDateParts[0]    // День
                );

                // Получаем первый день текущего месяца
                const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

                // Вычисляем первый день предыдущего месяца
                const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

                return targetDate >= firstDayOfPreviousMonth && targetDate < firstDayOfCurrentMonth;
            }
            return false; // Возвращаем false, если формат даты неправильный
        }

        const filtereditog = dataItog.filter((item) => isWithinLastMonth(item.date));

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
                    const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
                        if (cur2.buyer === elem.curator || nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer)) {
                            return acc2 + cur2.comPersent100;
                        }
                        return acc2;
                    }, 0);
                    return acc + curatorCommission;
                }, 0);

                const totalOrders = adminDataItog.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);


                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyBuyers.length).toFixed(0)).toFixed(0) / 1000).toFixed(1);
                const yourCommission = ((totalCommission) * 0.1).toFixed(0);

                return {
                    curator: elem.curator,
                    buyerLength: nonEmptyBuyers.length,
                    totalcom: totalCommission,
                    order: totalOrders,
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

async function calculateAndCacheDataCash30day() {
    if (!cachedData30day) {
        const result = await calculateAndCacheData30day();
        cachedData30day = result;
    }
}

calculateAndCacheDataCash30day();

const cacheUpdate30dayInterval = 600000;

setInterval(async () => {
    try {
        const result = await calculateAndCacheData30day();
        cachedData30day = result;
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}, cacheUpdate30dayInterval);

const calcRaintingManager30day = async (req, res) => {
    try {
        if (!cachedData30day) {
            await calculateAndCacheData30day();
        }
        res.json(cachedData30day);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export default { calcRaintingManager30day, calcRaintingManager };
