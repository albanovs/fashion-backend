import calclider from '../calc_raiting_manager.mjs';
import calcFenix from '../fenix.calc_raiting_manager.mjs';
import calcMonaco from '../monaco.calc_raiting_manager.mjs';
import calcfbox from '../newotdel.calc_raiting_manager.mjs';
import calcLiberty from '../newotdelliberty.calc_raiting_manager.mjs';
import calcTuran from '../turan.calc_raiting_manager.mjs';
import ManagerRaiting from '../../../models/manager-raiting/managerRaiting.mjs';

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

const getManagerRaiting = async (req, res) => {
    try {
        const today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        if (month === 1) {
            year -= 1;
            month = 12;
        } else {
            month -= 1;
        }
        const prevMonthData = `${year}-${month.toString().padStart(2, '0')}`;
        const data = await ManagerRaiting.findOne({ datas: prevMonthData });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'Данные за прошлый месяц отсутствуют' });
        }
    } catch (error) {
        console.error('Ошибка при получении данных за прошлый месяц:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
export default { updateCalcManager, getManagerRaiting }