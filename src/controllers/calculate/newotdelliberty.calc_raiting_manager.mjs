import simModelLiberty from '../../models/simcard/simliberty.mjs'
import LiderDataModel from '../../models/lider/liderData.mjs';
import MonacoDataModel from '../../models/monaco/monacoData.mjs';
import TuranDataModel from '../../models/turan/turanData.mjs';
import FenixDataModel from '../../models/fenix/fenixData.mjs';
import ManagerPersent from '../../models/manager-persent/manager-persent.mjs';
import {
    calculateTotalCommission, calculateTotalCommissionPercent,
    calculateTotalOrders, isCurrentMonthAndYear, percentVM as percVM
} from './utils/utils.mjs';
import LibertyDataModel from '../../models/liberty/libertyData.mjs';
import { calculateMatchesLogist, calculateSumComPersent100 } from './utils/detail-utils.mjs'
import cron from 'node-cron'
import NewOtdelDataModel from '../../models/new-otel/newOtdelData.mjs';

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [managers, dataItog, dataItogMonaco, dataItogTuran, dataItogFenix, dataItogNewOtdel, dataItogLiberty, managerperc] = await Promise.all([
            simModelLiberty.find(),
            LiderDataModel.find(),
            MonacoDataModel.find(),
            TuranDataModel.find(),
            FenixDataModel.find(),
            NewOtdelDataModel.find(),
            LibertyDataModel.find(),
            ManagerPersent.find()
        ]);

        const filtereditog = dataItog.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogmonaco = dataItogMonaco.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogturan = dataItogTuran.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditogfenix = dataItogFenix.filter((item) => isCurrentMonthAndYear(item.date));
        const filtereditognewotdel = dataItogNewOtdel.filter((item) => isCurrentMonthAndYear(item.date));
        const filteredliberty = dataItogLiberty.filter((item) => isCurrentMonthAndYear(item.date));

        const result = managers.map((elem) => {
            const nonEmptyBuyersStatic = elem.slot.filter((item) => item.buyer !== '');
            const nonEmptyBuyers = elem.slot.filter((item) => item.buyer !== '' && item.status === "2");

            if (nonEmptyBuyers.length > 0) {

                const totalCommission = calculateTotalCommission(filtereditog, elem, nonEmptyBuyers);
                const totalCommissionpercent = calculateTotalCommissionPercent(filtereditog, elem, nonEmptyBuyers);
                const totalOrders = calculateTotalOrders(filtereditog, elem, nonEmptyBuyers);

                const totalCommissionMonaco = calculateTotalCommission(filtereditogmonaco, elem, nonEmptyBuyers);
                const totalCommissionpercentMonaco = calculateTotalCommissionPercent(filtereditogmonaco, elem, nonEmptyBuyers);
                const totalOrdersMonaco = calculateTotalOrders(filtereditogmonaco, elem, nonEmptyBuyers);

                const totalCommissionTuran = calculateTotalCommission(filtereditogturan, elem, nonEmptyBuyers);
                const totalCommissionpercentTuran = calculateTotalCommissionPercent(filtereditogturan, elem, nonEmptyBuyers);
                const totalOrdersTuran = calculateTotalOrders(filtereditogturan, elem, nonEmptyBuyers);

                const totalCommissionFenix = calculateTotalCommission(filtereditogfenix, elem, nonEmptyBuyers);
                const totalCommissionpercentFenix = calculateTotalCommissionPercent(filtereditogfenix, elem, nonEmptyBuyers);
                const totalOrdersFenix = calculateTotalOrders(filtereditogfenix, elem, nonEmptyBuyers);

                const totalCommissionNewOtdel = calculateTotalCommission(filtereditognewotdel, elem, nonEmptyBuyers);
                const totalCommissionpercentNewOtdel = calculateTotalCommissionPercent(filtereditognewotdel, elem, nonEmptyBuyers);
                const totalOrdersNewOtdel = calculateTotalOrders(filtereditognewotdel, elem, nonEmptyBuyers);

                const totalCommissionLiberty = calculateTotalCommission(filteredliberty, elem, nonEmptyBuyers);
                const totalCommissionpercentLiberty = calculateTotalCommissionPercent(filteredliberty, elem, nonEmptyBuyers);
                const totalOrdersLiberty = calculateTotalOrders(filteredliberty, elem, nonEmptyBuyers);

                const totalCommissionall = totalCommission + totalCommissionMonaco + totalCommissionTuran
                    + totalCommissionFenix + totalCommissionNewOtdel + totalCommissionLiberty

                const totalCommissionpercentAll = totalCommissionpercent + totalCommissionpercentMonaco
                    + totalCommissionpercentTuran + totalCommissionpercentFenix + totalCommissionpercentNewOtdel + totalCommissionpercentLiberty

                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyBuyers.length).toFixed(0)).toFixed(0) / 1000).toFixed(1);
                const yourCommission = percVM(elem.curator, totalCommissionpercentAll);
                const сomissionVM = !elem.curator.includes("ВМ") ? (parseFloat(totalCommissionpercentAll) * 0.03).toFixed(0) : 0
                const totalOrdersAll = totalOrders + totalOrdersMonaco + totalOrdersTuran + totalOrdersFenix + totalOrdersNewOtdel + totalOrdersLiberty
                const coefficentOrder = (parseFloat(totalOrdersAll) / parseFloat(nonEmptyBuyers.length)).toFixed(1)

                const detailInfo = nonEmptyBuyers.map(logistItem => {

                    const matchesLogist = calculateMatchesLogist(filtereditog, logistItem);
                    const sumComPersent100 = calculateSumComPersent100(filtereditog, logistItem);

                    const matchesTuran = calculateMatchesLogist(filtereditogturan, logistItem);
                    const sumComPersent100turan = calculateSumComPersent100(filtereditogturan, logistItem);

                    const matchesFenix = calculateMatchesLogist(filtereditogfenix, logistItem);
                    const sumComPersent100fenix = calculateSumComPersent100(filtereditogfenix, logistItem);

                    const matchesMonaco = calculateMatchesLogist(filtereditogmonaco, logistItem);
                    const sumComPersent100monaco = calculateSumComPersent100(filtereditogmonaco, logistItem);

                    const matchesNewOtdel = calculateMatchesLogist(filtereditognewotdel, logistItem);
                    const sumComPersent100NewOtdel = calculateSumComPersent100(filtereditognewotdel, logistItem);

                    const matchesLiberty = calculateMatchesLogist(filteredliberty, logistItem);
                    const sumComPersent100Liberty = calculateSumComPersent100(filteredliberty, logistItem);


                    let allMatches = parseFloat(matchesLogist) + parseFloat(matchesTuran)
                        + parseFloat(matchesFenix) + parseFloat(matchesMonaco)
                        + parseFloat(matchesNewOtdel) + parseFloat(matchesLiberty)

                    let allItogs = parseFloat(sumComPersent100) + parseFloat(sumComPersent100fenix)
                        + parseFloat(sumComPersent100monaco) + parseFloat(sumComPersent100turan)
                        + parseFloat(sumComPersent100NewOtdel) + parseFloat(sumComPersent100Liberty)

                    return {
                        name: logistItem.buyer,
                        status: logistItem.status,
                        orders: allMatches,
                        summa: allItogs,
                        team: 'Liberty',
                        curator: elem.curator,
                        coeff: allMatches !== 0 ? ((parseFloat(allItogs) / parseFloat(allMatches)) / 1000).toFixed(1) : 0
                    };
                });

                return {
                    curator: elem.curator,
                    buyerLength: nonEmptyBuyers.length,
                    totalcom: totalCommissionall,
                    order: totalOrdersAll,
                    comission: parseFloat(yourCommission),
                    comissionVM: parseFloat(сomissionVM),
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

        let percentVM = 0
        result.forEach(elem => {
            if (!elem.curator.includes("ВМ")) {
                percentVM += parseFloat(elem.comissionVM)
            }
        })
        result.forEach(elem => {
            if (elem.curator.includes("ВМ")) {
                elem.comission += parseFloat(percentVM)
            }
        })

        result.forEach(elem => {
            const selectedManager = managerperc.find(i => {
                const currentDate = new Date();
                const managerDate = new Date(i.datas);
                return managerDate.getMonth() === currentDate.getMonth() &&
                    managerDate.getFullYear() === currentDate.getFullYear() &&
                    i.manager === elem.curator;
            });

            if (selectedManager && selectedManager.persent) {
                let allpercentsum = selectedManager.persent.reduce((acc, count) => acc += parseFloat(count.sum), 0);
                elem.for_withdrawal = elem.comission - parseFloat(allpercentsum);
            }
        });

        return result;

    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

const calcRaintingManagerLiberty = async (req, res) => {
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

const updateCalcManager = async () => {
    try {
        const result = await calculateAndCacheData();
        cachedData = result;
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

updateCalcManager()

cron.schedule('*/10 * * * *', async () => {
    try {
        await updateCalcManager();
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
});

simModelLiberty.on('change', updateCalcManager);
LiderDataModel.on('change', updateCalcManager);
MonacoDataModel.on('change', updateCalcManager);
TuranDataModel.on('change', updateCalcManager);
FenixDataModel.on('change', updateCalcManager);
LibertyDataModel.on('change', updateCalcManager);
NewOtdelDataModel.on('change', updateCalcManager);
ManagerPersent.on('change', updateCalcManager);

export default { calcRaintingManagerLiberty, updateCalcManager, calculateAndCacheData };
