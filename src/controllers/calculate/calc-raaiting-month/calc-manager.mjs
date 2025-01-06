import calclider from '../calc_raiting_manager.mjs';
import calcFenix from '../fenix.calc_raiting_manager.mjs';
import calcMonaco from '../monaco.calc_raiting_manager.mjs';
import calcfbox from '../newotdel.calc_raiting_manager.mjs';
import calcLiberty from '../newotdelliberty.calc_raiting_manager.mjs';
import calcTuran from '../turan.calc_raiting_manager.mjs';
import ManagerRaiting from '../../../models/manager-raiting/managerRaiting.mjs';
import cron from 'node-cron';
import BuyerRaiting from '../../../models/manager-raiting/buyer-raiting.mjs';

const updateCalcManager = async () => {
    try {
        const calculationFunctions = [
            calclider.calculateAndCacheData,
            calcFenix.calculateAndCacheData,
            calcMonaco.calculateAndCacheData,
            calcfbox.calculateAndCacheData,
            calcLiberty.calculateAndCacheData,
            calcTuran.calculateAndCacheData
        ];

        const raitingManager = [];

        for (const func of calculationFunctions) {
            const result = await func();
            raitingManager.push(...result);
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        // const dateString = `${year}-${month}`;
        const dateString = `2024-10`;

        const existingRecord = await ManagerRaiting.findOne({ datas: dateString });
        if (!existingRecord) {
        const dataToSave = {
            datas: dateString,
            managers: raitingManager
        };
        await ManagerRaiting.create(dataToSave);
        }
    } catch (error) {
        console.error('Ошибка при выполнении вычислений и сохранении данных:', error);
    }
};

let cachedData = null;

const extractDetailData = async (req, res) => {
    try {
        const calculationFunctions = [
            calclider.calculateAndCacheData,
            calcFenix.calculateAndCacheData,
            calcMonaco.calculateAndCacheData,
            calcfbox.calculateAndCacheData,
            calcLiberty.calculateAndCacheData,
            calcTuran.calculateAndCacheData
        ];

        const allDetails = [];

        for (const func of calculationFunctions) {
            const result = await func();
            result.forEach(manager => {
                allDetails.push(...manager.detail);
            });
        }
        allDetails.sort((a, b) => b.coeff - a.coeff);

        return allDetails;
    } catch (error) {
        console.error('Ошибка при извлечении данных из ключа detail:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

const updateCalcBuyer = async () => {
    try {
        const result = await extractDetailData();
        cachedData = result;
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

const getManagerRaiting = async (req, res) => {
    try {
        const data = await ManagerRaiting.find();
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'Данные за прошлый месяц отсутствуют' });
        }
    } catch (error) {
        console.error('Ошибка при получении данных за прошлый месяц:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
}

const getBuyerRaiting = async (req, res) => {
    try {
        if (!cachedData) {
            await extractDetailData();
        }
        res.json(cachedData);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

const getPreviousMonthDateString = (offset) => {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month}`;
};

const getDataForLastTwoMonths = async () => {
    const dateString1 = getPreviousMonthDateString(1);
    const dateString2 = getPreviousMonthDateString(2);

    const [data1, data2] = await Promise.all([
        ManagerRaiting.findOne({ datas: dateString1 }),
        ManagerRaiting.findOne({ datas: dateString2 })
    ]);

    return [data1, data2];
};

const sumAllCoeff = (data1, data2) => {
    const sum = {};

    const addToSum = (data) => {
        if (data && data.managers) {
            data.managers.forEach(manager => {
                if (manager.allCoeff && !manager.curator.includes('ВМ')) {
                    if (!sum[manager.curator]) {
                        sum[manager.curator] = {
                            allCoeff: 0,
                            buyerLength: manager.buyerLength
                        };
                    }
                    sum[manager.curator].allCoeff += parseFloat(manager.allCoeff);
                }
            });
        }
    };

    addToSum(data1);
    addToSum(data2);

    const sortedArray = Object.entries(sum).map(([curator, values]) => ({ curator, ...values }));
    sortedArray.sort((a, b) => b.allCoeff - a.allCoeff);

    return sortedArray;
};

let cachedData2 = null;

const calculateSumAllCoeffAndBuyerLengthForLastTwoMonths = async () => {

    const [data1, data2] = await getDataForLastTwoMonths();
    const sumCoeffs = sumAllCoeff(data1, data2);
    cachedData2 = sumCoeffs;
};

// calculateSumAllCoeffAndBuyerLengthForLastTwoMonths()

const getmanagerlast2Raiting = async (req, res) => {
    try {
        if (!cachedData2) {
            await calculateSumAllCoeffAndBuyerLengthForLastTwoMonths();
        }
        res.json(cachedData2);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// cron.schedule('*/20 * * * *', async () => {
//     try {
//         await updateCalcBuyer();
//         await calculateSumAllCoeffAndBuyerLengthForLastTwoMonths()
//     } catch (error) {
//         console.error('Ошибка при выполнении вычислений:', error);
//     }
// });

export default { updateCalcManager, getManagerRaiting, getBuyerRaiting, getmanagerlast2Raiting }