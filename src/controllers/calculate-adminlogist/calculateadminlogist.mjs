import LogistAndAdmin from "../../models/simcardlogist/logistandadmin.mjs";
import LiderDataModel from "../../models/lider/liderData.mjs";
import MonacoDataModel from "../../models/monaco/monacoData.mjs";
import TuranDataModel from "../../models/turan/turanData.mjs";
import FenixDataModel from "../../models/fenix/fenixData.mjs";
import NewOtdelDataModel from "../../models/new-otel/newOtdelData.mjs";
import LibertyDataModel from "../../models/liberty/libertyData.mjs";
import { calculateMatchesLogist, calculateSumComPersent100 } from "../calculate/utils/detail-utils.mjs";
import { isCurrentMonthAndYear } from "../calculate/utils/utils.mjs";


let cachedData = null;
async function calculateAndCasheData() {
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
            let filtereditog;
            switch (item.team) {
                case 'leader':
                    filtereditog = leader.filter(leaderItem => isCurrentMonthAndYear(leaderItem.date));
                    break;
                case 'monaco':
                    filtereditog = monaco.filter(monacoItem => isCurrentMonthAndYear(monacoItem.date));
                    break;
                case 'turan':
                    filtereditog = turan.filter(turanItem => isCurrentMonthAndYear(turanItem.date));
                    break;
                case 'liberty':
                    filtereditog = liberty.filter(libertyItem => isCurrentMonthAndYear(libertyItem.date));
                    break;
                case 'ilyas':
                    filtereditog = ilyas.filter(ilyasItem => isCurrentMonthAndYear(ilyasItem.date));
                    break;
                case 'yntymak':
                    filtereditog = yntymak.filter(yntymakItem => isCurrentMonthAndYear(yntymakItem.date));
                    break;
                default:
                    filtereditog = [];
            }

            const nonEmptyLogist = item.slot.filter(slotItem => slotItem.logist !== '' && slotItem.status === '2');

            const datasRaiting = nonEmptyLogist.map(elem => {
                const matchesLogist = calculateMatchesLogist(filtereditog, elem);
                const sumComPersent100 = calculateSumComPersent100(filtereditog, elem);

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
                allRatings[item.team] = allRatings[item.team].concat(datasRaiting);
            }
        });

        return allRatings;

    } catch (error) {
        console.log(error);
    }
}

async function calculateAndCacheDataCash() {
    const result = await calculateAndCasheData();
    cachedData = result;
}

calculateAndCacheDataCash();

cron.schedule('*/10 * * * *', async () => {
    try {
        await calculateAndCacheDataCash();
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
});

const calcRaintingLogistAdmin = async (req, res) => {
    try {
        if (!cachedData) {
            await calculateAndCasheData();
        }
        res.json(cachedData);
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export default { calcRaintingLogistAdmin };