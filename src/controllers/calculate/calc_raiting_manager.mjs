import simModelLier from '../../models/simcard/simlider.mjs';
import LiderDataModel from '../../models/lider/liderData.mjs';
import MonacoDataModel from '../../models/monaco/monacoData.mjs';
import TuranDataModel from '../../models/turan/turanData.mjs';
import FenixDataModel from '../../models/fenix/fenixData.mjs';

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [managers, dataItog, dataItogMonaco, dataItogTuran, dataItogFenix] = await Promise.all([
            simModelLier.find(),
            LiderDataModel.find(),
            MonacoDataModel.find(),
            TuranDataModel.find(),
            FenixDataModel.find()
        ]);

        function isCurrentMonthAndYear(dateString) {
            const currentDate = new Date();
            const [day, month, year] = dateString.split('.').map(Number);
            return currentDate.getFullYear() === year && currentDate.getMonth() + 1 === month;
        }

        const filtereditog = dataItog.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogmonaco = dataItogMonaco.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogturan = dataItogTuran.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogfenix = dataItogFenix.filter((item) => isCurrentMonthAndYear(item.date));

        const result = managers.map((elem) => {
            const nonEmptyBuyersStatic = elem.slot.filter((item) => item.buyer !== '');
            const nonEmptyBuyers = elem.slot.filter((item) => item.buyer !== '' && item.status === "2");

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
                            return acc2 + cur2.itog;
                        }
                        return acc2;
                    }, 0);
                    return acc + curatorCommission;
                }, 0);

                // const totalOrders = adminDataItog.reduce((acc, cur) => {
                //     return acc + cur.otchet.reduce((acc2, cur2) => {
                //         const matchesCurator = cur2.buyer === elem.curator;
                //         const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                //         return acc2 + (matchesCurator  || matchesNonEmptyBuyers ? 1 : 0);
                //     }, 0);
                // }, 0);

                const totalOrders = adminDataItog.reduce((acc, cur) => {
                    let documentMatches = {}; // Создаём пустой объект для отслеживания совпадений внутри одного документа

                    cur.otchet.forEach((otchetItem) => {
                        nonEmptyBuyers.forEach((buyerItem) => {
                            // Проверяем совпадение покупателя внутри одного документа
                            if (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator) {
                                // Если находим совпадение, увеличиваем счётчик для этого покупателя внутри документа
                                documentMatches[otchetItem.buyer] = (documentMatches[otchetItem.buyer] || 0) + 1;
                            }
                        });
                    });

                    // Вы можете использовать информацию в documentMatches для своих вычислений
                    // Например, чтобы получить общее количество совпадений внутри этого документа:
                    const documentTotalMatches = Object.values(documentMatches).reduce((total, count) => total + count, 0);
                    // Или для получения количества уникальных совпадений:
                    // const uniqueMatches = Object.keys(documentMatches).length;

                    // Не забудьте добавить эти значения в общий аккумулятор acc
                    // acc += documentTotalMatches; // или acc += uniqueMatches; в зависимости от вашей логики

                    return acc;
                }, 0);

                const adminDataItogMonaco = filtereditogmonaco.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommissionMonaco = adminDataItogMonaco.reduce((acc, cur) => {
                    const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
                        if (cur2.buyer === elem.curator || nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer)) {
                            return acc2 + cur2.itog;
                        }
                        return acc2;
                    }, 0);
                    return acc + curatorCommission;
                }, 0);

                const totalOrdersMonaco = adminDataItogMonaco.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);

                const adminDataItogTuran = filtereditogturan.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommissionTuran = adminDataItogTuran.reduce((acc, cur) => {
                    const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
                        if (cur2.buyer === elem.curator || nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer)) {
                            return acc2 + cur2.itog;
                        }
                        return acc2;
                    }, 0);
                    return acc + curatorCommission;
                }, 0);

                const totalOrdersTuran = adminDataItogTuran.reduce((acc, cur) => {
                    return acc + cur.otchet.reduce((acc2, cur2) => {
                        const matchesCurator = cur2.buyer === elem.curator;
                        const matchesNonEmptyBuyers = nonEmptyBuyers.some((buyerItem) => cur2.buyer === buyerItem.buyer);
                        return acc2 + (matchesCurator || matchesNonEmptyBuyers ? 1 : 0);
                    }, 0);
                }, 0);

                const adminDataItogFenix = filtereditogfenix.filter((itog) => {
                    return itog.otchet.some((otchetItem) => {
                        return nonEmptyBuyers.some((buyerItem) => {
                            return otchetItem.buyer && (otchetItem.buyer === buyerItem.buyer || otchetItem.buyer === elem.curator);
                        });
                    });
                });

                const totalCommissionFenix = adminDataItogFenix.reduce((acc, cur) => {
                    const curatorCommission = cur.otchet.reduce((acc2, cur2) => {
                        if (cur2.buyer === elem.curator || nonEmptyBuyers.some(logist => logist.buyer === cur2.buyer)) {
                            return acc2 + cur2.itog;
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

                const totalCommissionall = totalCommission + totalCommissionMonaco + totalCommissionTuran + totalCommissionFenix
                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyBuyers.length).toFixed(0)).toFixed(0) / 1000).toFixed(1);
                const yourCommission = ((totalCommission) * 0.1).toFixed(0);
                const totalOrdersAll = totalOrders + totalOrdersMonaco + totalOrdersTuran + totalOrdersFenix
                const coefficentOrder = (parseFloat(totalOrdersAll) / parseFloat(nonEmptyBuyers.length)).toFixed(1)

                const detailInfo = nonEmptyBuyers.map(logistItem => {

                    const matchesLogist = adminDataItog.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? 1 : 0);
                        }, 0);
                    }, 0);

                    const sumComPersent100 = adminDataItog.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? cur2.itog : 0);
                        }, 0);
                    }, 0);

                    const matchesTuran = dataItogTuran.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? 1 : 0);
                        }, 0);
                    }, 0);

                    const sumComPersent100turan = dataItogTuran.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? cur2.itog : 0);
                        }, 0);
                    }, 0);

                    const matchesFenix = dataItogFenix.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? 1 : 0);
                        }, 0);
                    }, 0);

                    const sumComPersent100fenix = dataItogFenix.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? cur2.itog : 0);
                        }, 0);
                    }, 0);

                    const matchesMonaco = dataItogMonaco.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? 1 : 0);
                        }, 0);
                    }, 0);

                    const sumComPersent100monaco = dataItogMonaco.reduce((acc, cur) => {
                        return acc + cur.otchet.reduce((acc2, cur2) => {
                            return acc2 + (cur2.buyer === logistItem.buyer ? cur2.itog : 0);
                        }, 0);
                    }, 0);

                    let allMatches = parseFloat(matchesLogist) + parseFloat(matchesTuran) + parseFloat(matchesFenix) + parseFloat(matchesMonaco)
                    let allItogs = parseFloat(sumComPersent100) + parseFloat(sumComPersent100fenix) + parseFloat(sumComPersent100monaco) + parseFloat(sumComPersent100turan)

                    return {
                        name: logistItem.buyer,
                        status: logistItem.status,
                        orders: allMatches,
                        summa: allItogs,
                    };
                });

                return {
                    curator: elem.curator,
                    buyerLength: nonEmptyBuyers.length,
                    totalcom: totalCommissionall,
                    order: totalOrdersAll,
                    comission: yourCommission,
                    allCoeff: (parseFloat(coefficentOrder) + parseFloat(coefficent)).toFixed(1),
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

export default { calcRaintingManager };
