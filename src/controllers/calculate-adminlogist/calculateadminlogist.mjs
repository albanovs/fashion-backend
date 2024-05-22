import LogistAndAdmin from "../../models/simcardlogist/logistandadmin.mjs";
import LiderDataModel from "../../models/lider/liderData.mjs";
import MonacoDataModel from "../../models/monaco/monacoData.mjs";
import TuranDataModel from "../../models/turan/turanData.mjs";
import FenixDataModel from "../../models/fenix/fenixData.mjs";
import NewOtdelDataModel from "../../models/new-otel/newOtdelData.mjs";
import LibertyDataModel from "../../models/liberty/libertyData.mjs";
import { calculateMatchesLogist, calculateSumComPersent100 } from "../calculate/utils/detail-utils.mjs";
import { isCurrentMonthAndYear } from "../calculate/utils/utils.mjs";
import cron from 'node-cron'; 

let cachedData = null;

async function calculateAndCacheData() {
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

        const allRatings = {
            leader: [],
            monaco: [],
            turan: [],
            liberty: [],
            ilyas: [],
            yntymak: []
        };

        adminAndLogist.forEach(item => {
            let filteredItems;
            switch (item.team) {
                case 'leader':
                    filteredItems = leader.filter(leaderItem => isCurrentMonthAndYear(leaderItem.date));
                    break;
                case 'monaco':
                    filteredItems = monaco.filter(monacoItem => isCurrentMonthAndYear(monacoItem.date));
                    break;
                case 'turan':
                    filteredItems = turan.filter(turanItem => isCurrentMonthAndYear(turanItem.date));
                    break;
                case 'liberty':
                    filteredItems = liberty.filter(libertyItem => isCurrentMonthAndYear(libertyItem.date));
                    break;
                case 'ilyas':
                    filteredItems = ilyas.filter(ilyasItem => isCurrentMonthAndYear(ilyasItem.date));
                    break;
                case 'yntymak':
                    filteredItems = yntymak.filter(yntymakItem => isCurrentMonthAndYear(yntymakItem.date));
                    break;
                default:
                    filteredItems = [];
            }

            const nonEmptyLogist = item.slot.filter(slotItem => slotItem.logist !== '' && slotItem.status === '2');

            const dataRatings = nonEmptyLogist.map(elem => {
                const matchesLogist = calculateMatchesLogist(filteredItems, elem);
                const sumComPersent100 = calculateSumComPersent100(filteredItems, elem);

                const coeff = (sumComPersent100 === 0 || matchesLogist === 0) ? 0 : ((parseFloat(sumComPersent100) / parseFloat(matchesLogist).toFixed(0)) / 10000).toFixed(1);

                return {
                    select: item.select,
                    name: elem.logist,
                    order: matchesLogist,
                    sum: sumComPersent100,
                    coeff: coeff
                };
            });

            if (item.team in allRatings) {
                allRatings[item.team] = allRatings[item.team].concat(dataRatings);
            }
        });

        return allRatings;

    } catch (error) {
        console.error(error);
    }
}

async function calculateAndCacheDataWrapper() {
    const result = await calculateAndCacheData();
    cachedData = result;
}

calculateAndCacheDataWrapper();

cron.schedule('*/10 * * * *', async () => {
    try {
        await calculateAndCacheDataWrapper();
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
});

const calcRaintingLogistAdmin = async (req, res) => {
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

export default { calcRaintingLogistAdmin };
