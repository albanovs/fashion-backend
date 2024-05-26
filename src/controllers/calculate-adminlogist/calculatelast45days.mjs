import LogistAndAdmin from "../../models/simcardlogist/logistandadmin.mjs";
import LiderDataModel from "../../models/lider/liderData.mjs";
import MonacoDataModel from "../../models/monaco/monacoData.mjs";
import TuranDataModel from "../../models/turan/turanData.mjs";
import FenixDataModel from "../../models/fenix/fenixData.mjs";
import NewOtdelDataModel from "../../models/new-otel/newOtdelData.mjs";
import LibertyDataModel from "../../models/liberty/libertyData.mjs";
import { calculateMatchesLogist, calculateSumComPersent100 } from "../calculate-logist/utils/detail-logist.mjs";
import { isCurrentMonthAndYear, isWithinLast45Days } from "../calculate-logist/utils/utils.mjs";
import cron from 'node-cron';

async function calculateAdminData() {
    try {
        const [adminAndLogist, leader, monaco, turan, ilyas, yntymak, liberty] = await Promise.all([
            LogistAndAdmin.find(),
            LiderDataModel.find(),
            MonacoDataModel.find(),
            TuranDataModel.find(),
            FenixDataModel.find(),
            NewOtdelDataModel.find(),
            LibertyDataModel.find(),
        ]);

        const adminRatings = [];

        adminAndLogist.forEach(item => {
            if (item.select !== 'admin') return;

            let filteredItems = [];
            switch (item.team) {
                case 'leader':
                    filteredItems = leader.filter(leaderItem => isWithinLast45Days(leaderItem.date));
                    break;
                case 'monaco':
                    filteredItems = monaco.filter(monacoItem => isWithinLast45Days(monacoItem.date));
                    break;
                case 'turan':
                    filteredItems = turan.filter(turanItem => isWithinLast45Days(turanItem.date));
                    break;
                case 'liberty':
                    filteredItems = liberty.filter(libertyItem => isWithinLast45Days(libertyItem.date));
                    break;
                case 'ilyas':
                    filteredItems = ilyas.filter(ilyasItem => isWithinLast45Days(ilyasItem.date));
                    break;
                case 'yntymak':
                    filteredItems = yntymak.filter(yntymakItem => isWithinLast45Days(yntymakItem.date));
                    break;
                default:
                    filteredItems = [];
            }

            const nonEmptyLogist = item.slot.filter(slotItem => slotItem.logist !== '' && slotItem.status === '2');

            nonEmptyLogist.forEach(elem => {
                const matchesLogist = calculateMatchesLogist(filteredItems, elem);
                const sumComPersent100 = calculateSumComPersent100(filteredItems, elem);

                const coeff = (sumComPersent100 === 0 || matchesLogist === 0) ? 0 : ((parseFloat(sumComPersent100) * parseFloat(matchesLogist)) / 10000).toFixed(4);

                const dataRating = {
                    team: item.team,
                    select: item.select,
                    name: elem.logist,
                    order: matchesLogist,
                    sum: sumComPersent100,
                    coeff: coeff
                };

                adminRatings.push(dataRating);
            });
        });

        adminRatings.sort((a, b) => b.coeff - a.coeff);

        return adminRatings;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function calculateAndCacheAdminDataWrapper() {
    const result = await calculateAdminData();
    cachedAdminData = result;
}

let cachedAdminData = null;

calculateAndCacheAdminDataWrapper();

cron.schedule('*/10 * * * *', async () => {
    try {
        await calculateAndCacheAdminDataWrapper();
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
});

const calcRaintingAdmin45days = async (req, res) => {
    try {
        if (!cachedAdminData) {
            await calculateAndCacheAdminDataWrapper();
        }
        res.json(cachedAdminData);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export default { calcRaintingAdmin45days };