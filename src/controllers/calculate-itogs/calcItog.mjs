import LiderDataModel from "../../models/lider/liderData.mjs";
import MonacoDataModel from "../../models/monaco/monacoData.mjs";
import FenixDataModel from "../../models/fenix/fenixData.mjs";
import TuranDataModel from "../../models/turan/turanData.mjs";
import NewOtdelDataModel from "../../models/new-otel/newOtdelData.mjs";

let cachedData = null

async function calculateAndCacheData() {
    let itogs = {
        otdel: {
            lider: [],
            monaco: [],
            fenix: [],
            turan: [],
            newOtdel: []
        },
        totalAllItog: {
            lider: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            monaco: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            fenix: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            turan: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            newOtdel: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            allItogs: {
                itog: 0,
                itogIndex: 0,
                allItog: 0,
            },
        },
    }

    try {
        const [liderData, monacoData, fenixData, turanData, newOtdelData] = await Promise.all([
            LiderDataModel.find(),
            MonacoDataModel.find(),
            FenixDataModel.find(),
            TuranDataModel.find(),
            NewOtdelDataModel.find(),
        ]);

        const currentMonth = new Date().toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' });

        const filterDataByCurrentMonth = (data) => {
            return data.filter((item) => {
                const itemDate = item.date;
                const itemMonthYear = itemDate.split('.').slice(1).join('/');
                return itemMonthYear === currentMonth;
            });
        };

        const filteredLiderData = filterDataByCurrentMonth(liderData);
        const filteredMonacoData = filterDataByCurrentMonth(monacoData);
        const filteredFenixData = filterDataByCurrentMonth(fenixData);
        const filteredTuranData = filterDataByCurrentMonth(turanData);
        const filteredNewOtdelData = filterDataByCurrentMonth(turanData);

        itogs.otdel.lider = filteredLiderData
        itogs.otdel.monaco = filteredMonacoData
        itogs.otdel.turan = filteredTuranData
        itogs.otdel.fenix = filteredFenixData
        itogs.otdel.newOtdel = filteredNewOtdelData

        const calculateTotalAllItog = (data) => {
            return data.reduce((acc, elem) => {
                const itogSum = elem.itog.reduce((subAcc, item) => {
                    return subAcc + item.allItog;
                }, 0);
                const itogIndexSum = elem.itog.reduce((subAcc, item) => {
                    return subAcc + item.allItogIndex;
                }, 0);
                return {
                    itog: acc.itog + itogSum,
                    index: acc.index + itogIndexSum,
                    allItog: acc.allItog + itogSum + itogIndexSum,
                };
            }, { itog: 0, index: 0, allItog: 0 });
        };


        itogs.totalAllItog.lider = calculateTotalAllItog(filteredLiderData)
        itogs.totalAllItog.monaco = calculateTotalAllItog(filteredMonacoData)
        itogs.totalAllItog.fenix = calculateTotalAllItog(filteredFenixData)
        itogs.totalAllItog.turan = calculateTotalAllItog(filteredTuranData)
        itogs.totalAllItog.newOtdel = calculateTotalAllItog(filteredNewOtdelData)
        itogs.totalAllItog.allItogs = calculateTotalAllItog([...filteredLiderData, ...filteredMonacoData, ...filteredFenixData, ...filteredTuranData, ...filteredNewOtdelData])

        const allPercentIndex = (itogs.totalAllItog.lider.index + itogs.totalAllItog.monaco.index + itogs.totalAllItog.turan.index + itogs.totalAllItog.fenix.index + itogs.totalAllItog.newOtdel.index)
        const allPercentComission = (itogs.totalAllItog.lider.itog + itogs.totalAllItog.monaco.itog + itogs.totalAllItog.fenix.itog + itogs.totalAllItog.turan.itog + + itogs.totalAllItog.newOtdel.itog)
        itogs.totalAllItog.lider.percentIndex = ((itogs.totalAllItog.lider.index / allPercentIndex) * 100).toFixed(0)
        itogs.totalAllItog.monaco.percentIndex = ((itogs.totalAllItog.monaco.index / allPercentIndex) * 100).toFixed(0)
        itogs.totalAllItog.turan.percentIndex = ((itogs.totalAllItog.turan.index / allPercentIndex) * 100).toFixed(0)
        itogs.totalAllItog.fenix.percentIndex = ((itogs.totalAllItog.fenix.index / allPercentIndex) * 100).toFixed(0)
        itogs.totalAllItog.newOtdel.percentIndex = ((itogs.totalAllItog.newOtdel.index / allPercentIndex) * 100).toFixed(0)
        itogs.totalAllItog.lider.percentItog = ((itogs.totalAllItog.lider.itog / allPercentComission) * 100).toFixed(0)
        itogs.totalAllItog.monaco.percentItog = ((itogs.totalAllItog.monaco.itog / allPercentComission) * 100).toFixed(0)
        itogs.totalAllItog.turan.percentItog = ((itogs.totalAllItog.turan.itog / allPercentComission) * 100).toFixed(0)
        itogs.totalAllItog.fenix.percentItog = ((itogs.totalAllItog.fenix.itog / allPercentComission) * 100).toFixed(0)
        itogs.totalAllItog.newOtdel.percentItog = ((itogs.totalAllItog.newOtdel.itog / allPercentComission) * 100).toFixed(0)

        return itogs

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

const calcItogs = async (req, res) => {
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

export default { calcItogs };