import lider from '../../calculate-logist/liders.calc_raiting.mjs'
import monaco from '../../calculate-logist/monaco.calc_raiting_manager.mjs'
import turan from '../../calculate-logist/turan.calc_raiting.mjs'
import liberty from '../../calculate-logist/liberty.calc_raiting.mjs'
import ilyas from '../../calculate-logist/fenix.calc_raiting_manager.mjs'
import yntymak from '../../calculate-logist/newotdel.calc_raiting.mjs'
import StAdminRaiting from '../../../models/adminlogistraiting/st_admin.mjs'

const saveCalcStAdmin = async () => {
    try {
        const calculationFunctions = [
            lider.calculateAndCacheData,
            monaco.calculateAndCacheData,
            turan.calculateAndCacheData,
            liberty.calculateAndCacheData,
            ilyas.calculateAndCacheData,
            yntymak.calculateAndCacheData
        ];

        const raitingStAdmin = [];

        for (const func of calculationFunctions) {
            const result = await func();
            raitingStAdmin.push(...result);
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const dateString = `${year}-${month}`;

        const dataToSave = {
            datas: dateString,
            st_admins: raitingStAdmin
        };
        await StAdminRaiting.create(dataToSave);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений и сохранении данных:', error);
    }
};

const getStAdminRaiting = async (req, res) => {
    try {
        const data = await StAdminRaiting.find();
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

export default { getStAdminRaiting, saveCalcStAdmin }