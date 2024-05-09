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
        const dataToSave = {
            datas: `${year}-${month}`,
            managers: raitingManager
        };
        await ManagerRaiting.create(dataToSave);
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

const saveBuyerRaiting = async () => {
    try {
        const result = await extractDetailData();
        if (result) {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const dataToSave = {
                datas: `${year}-${month}`,
                managers: result
            };
            await BuyerRaiting.create(dataToSave);
        }
    } catch (error) {
        console.log(error);
    }
}

updateCalcBuyer()

cron.schedule('*/20 * * * *', async () => {
    try {
        await updateCalcBuyer();
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
});
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
export default { updateCalcManager, getManagerRaiting, getBuyerRaiting , saveBuyerRaiting}