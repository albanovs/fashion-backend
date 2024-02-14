import simModelLier from '../../models/simcard/simlider.mjs';
import LiderDataModel from '../../models/lider/liderData.mjs';
import MonacoDataModel from '../../models/monaco/monacoData.mjs';
import TuranDataModel from '../../models/turan/turanData.mjs';
import FenixDataModel from '../../models/fenix/fenixData.mjs';
import NewOtdelDataModel from '../../models/new-otel/newOtdelData.mjs';
import ManagerPersent from '../../models/manager-persent/manager-persent.mjs'
import cron from 'node-cron'
import {
    filterAdminDataItog, calculateTotalCommission,
    calculateTotalCommissionPercent,
    calculateTotalOrders, isCurrentMonthAndYear,
} from './utils/utils.mjs';
import LibertyDataModel from '../../models/liberty/libertyData.mjs';
import { calculateMatchesLogist, calculateSumComPersent100 } from './utils/detail-utils.mjs'

let cachedData = null;

async function calculateAndCacheData() {
    try {
        const [managers, dataItog, dataItogMonaco, dataItogTuran, dataItogFenix, dataItogNewOtdel, dataItogLiberty, managerperc] = await Promise.all([
            simModelLier.find(),
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

                const adminDataItog = filterAdminDataItog(filtereditog, nonEmptyBuyers, elem);
                const totalCommission = calculateTotalCommission(adminDataItog, elem, nonEmptyBuyers);
                const totalCommissionpercent = calculateTotalCommissionPercent(adminDataItog, elem, nonEmptyBuyers);
                const totalOrders = calculateTotalOrders(adminDataItog, elem, nonEmptyBuyers);

                const adminDataItogMonaco = filterAdminDataItog(filtereditogmonaco, nonEmptyBuyers, elem);
                const totalCommissionMonaco = calculateTotalCommission(adminDataItogMonaco, elem, nonEmptyBuyers);
                const totalCommissionpercentMonaco = calculateTotalCommissionPercent(adminDataItogMonaco, elem, nonEmptyBuyers);
                const totalOrdersMonaco = calculateTotalOrders(adminDataItogMonaco, elem, nonEmptyBuyers);

                const adminDataItogTuran = filterAdminDataItog(filtereditogturan, nonEmptyBuyers, elem);
                const totalCommissionTuran = calculateTotalCommission(adminDataItogTuran, elem, nonEmptyBuyers);
                const totalCommissionpercentTuran = calculateTotalCommissionPercent(adminDataItogTuran, elem, nonEmptyBuyers);
                const totalOrdersTuran = calculateTotalOrders(adminDataItogTuran, elem, nonEmptyBuyers);

                const adminDataItogFenix = filterAdminDataItog(filtereditogfenix, nonEmptyBuyers, elem);
                const totalCommissionFenix = calculateTotalCommission(adminDataItogFenix, elem, nonEmptyBuyers);
                const totalCommissionpercentFenix = calculateTotalCommissionPercent(adminDataItogFenix, elem, nonEmptyBuyers);
                const totalOrdersFenix = calculateTotalOrders(adminDataItogFenix, elem, nonEmptyBuyers);

                const adminDataItogNewOtdel = filterAdminDataItog(filtereditognewotdel, nonEmptyBuyers, elem);
                const totalCommissionNewOtdel = calculateTotalCommission(adminDataItogNewOtdel, elem, nonEmptyBuyers);
                const totalCommissionpercentNewOtdel = calculateTotalCommissionPercent(adminDataItogNewOtdel, elem, nonEmptyBuyers);
                const totalOrdersNewOtdel = calculateTotalOrders(adminDataItogNewOtdel, elem, nonEmptyBuyers);

                const adminDataItogLiberty = filterAdminDataItog(filteredliberty, nonEmptyBuyers, elem);
                const totalCommissionLiberty = calculateTotalCommission(adminDataItogLiberty, elem, nonEmptyBuyers);
                const totalCommissionpercentLiberty = calculateTotalCommissionPercent(adminDataItogLiberty, elem, nonEmptyBuyers);
                const totalOrdersLiberty = calculateTotalOrders(adminDataItogLiberty, elem, nonEmptyBuyers);

                const totalCommissionall = totalCommission + totalCommissionMonaco + totalCommissionTuran
                    + totalCommissionFenix + totalCommissionNewOtdel + totalCommissionLiberty

                const totalCommissionpercentAll = totalCommissionpercent + totalCommissionpercentMonaco
                    + totalCommissionpercentTuran + totalCommissionpercentFenix + totalCommissionpercentNewOtdel + totalCommissionpercentLiberty

                const coefficent = ((parseFloat(totalCommission) / parseFloat(nonEmptyBuyers.length).toFixed(0)).toFixed(0) / 1000).toFixed(1);
                const yourCommission = ((totalCommissionpercentAll) * 0.07).toFixed(0);
                const commissionVM = ((totalCommissionpercentAll) * 0.03).toFixed(0);
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
                    };
                });

                return {
                    curator: elem.curator,
                    buyerLength: nonEmptyBuyers.length,
                    totalcom: totalCommissionall,
                    order: totalOrdersAll,
                    comission: yourCommission,
                    comissonVM: commissionVM,
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

        result.forEach(elem => {
            const selectedManager = managerperc.find(i => {
                const currentDate = new Date();
                const managerDate = new Date(i.datas);
                return managerDate.getDate() === currentDate.getDate() &&
                    managerDate.getMonth() === currentDate.getMonth() &&
                    managerDate.getFullYear() === currentDate.getFullYear() &&
                    i.manager === elem.curator;
            });

            if (selectedManager && selectedManager.persent) {
                let allpercentsum = selectedManager.persent.reduce((acc, count) => acc += parseFloat(count.sum), 0);
                elem.for_withdrawal = elem.comission - parseFloat(allpercentsum);
            }
        });

        let percentVM = 0
        result.forEach(elem => percentVM += elem.comissonVM)
        result.forEach(elem => {
            if (elem.curator.includes("ВМ")) {
                elem.comission = percentVM
            }
        })

        return result;

    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

const calcRaintingManager = async (req, res) => {
    try {
        if (!cachedData) {
            await calculateAndCacheData();
        }
        res.json(cachedData);
        // const result = await calculateAndCacheData()
        // res.json(result)
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

cron.schedule('*/10 * * * *', async () => {
    try {
        await updateCalcManager();
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
});

updateCalcManager()

simModelLier.on('change', updateCalcManager);
LiderDataModel.on('change', updateCalcManager);
MonacoDataModel.on('change', updateCalcManager);
TuranDataModel.on('change', updateCalcManager);
FenixDataModel.on('change', updateCalcManager);
NewOtdelDataModel.on('change', updateCalcManager);
LibertyDataModel.on('change', updateCalcManager);
ManagerPersent.on('change', updateCalcManager);

export default { calcRaintingManager, updateCalcManager };