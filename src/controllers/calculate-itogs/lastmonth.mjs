import LiderDataModel from "../../models/lider/liderData.mjs";
import MonacoDataModel from "../../models/monaco/monacoData.mjs";
import FenixDataModel from "../../models/fenix/fenixData.mjs";
import TuranDataModel from "../../models/turan/turanData.mjs";
import LibertyDataModel from "../../models/liberty/libertyData.mjs";
import NewOtdelDataModel from "../../models/new-otel/newOtdelData.mjs";
import OtdelLink from "../../models/otdel-link/otdel-link.mjs";
import mongoose from 'mongoose';

let cachedData = null;

async function calculateAndCacheData() {
    let itogs = {
        otdel: {
            lider: [],
            monaco: [],
            fenix: [],
            turan: [],
            fbox: [],
            liberty: []
        },
        totalAllItog: {
            lider: { itog: 0, index: 0, allItog: 0, percentItog: 0, percentIndex: 0 },
            monaco: { itog: 0, index: 0, allItog: 0, percentItog: 0, percentIndex: 0 },
            fenix: { itog: 0, index: 0, allItog: 0, percentItog: 0, percentIndex: 0 },
            turan: { itog: 0, index: 0, allItog: 0, percentItog: 0, percentIndex: 0 },
            fbox: { itog: 0, index: 0, allItog: 0, percentItog: 0, percentIndex: 0 },
            liberty: { itog: 0, index: 0, allItog: 0, percentItog: 0, percentIndex: 0 },
            allItogs: { itog: 0, itogIndex: 0, allItog: 0 },
        },
    };

    try {
        const [liderData, monacoData, fenixData, turanData, newOtdelData, libertyData] = await Promise.all([
            LiderDataModel.find(),
            MonacoDataModel.find(),
            FenixDataModel.find(),
            TuranDataModel.find(),
            NewOtdelDataModel.find(),
            LibertyDataModel.find(),
        ]);

        const filterDataByPreviousMonth = (data) => {
            const previousMonth = new Date();
            previousMonth.setMonth(previousMonth.getMonth() - 1);
            const month = previousMonth.getMonth() + 1;
            const year = previousMonth.getFullYear();

            return data.filter((item) => {
                const itemDate = item.date;
                const [itemDay, itemMonth, itemYear] = itemDate.split('.');
                return parseInt(itemYear) === year && parseInt(itemMonth) === month;
            });
        };

        const filteredLiderData = filterDataByPreviousMonth(liderData);
        const filteredMonacoData = filterDataByPreviousMonth(monacoData);
        const filteredFenixData = filterDataByPreviousMonth(fenixData);
        const filteredTuranData = filterDataByPreviousMonth(turanData);
        const filteredNewOtdelData = filterDataByPreviousMonth(newOtdelData);
        const filteredLibertyData = filterDataByPreviousMonth(libertyData);

        itogs.otdel.lider = filteredLiderData;
        itogs.otdel.monaco = filteredMonacoData;
        itogs.otdel.fenix = filteredFenixData;
        itogs.otdel.turan = filteredTuranData;
        itogs.otdel.fbox = filteredNewOtdelData;
        itogs.otdel.liberty = filteredLibertyData;

        const calculateTotalAllItog = (data) => {
            return data.reduce((acc, elem) => {
                const itogSum = elem.itog.reduce((subAcc, item) => subAcc + item.allItog, 0);
                const itogIndexSum = elem.itog.reduce((subAcc, item) => subAcc + item.allItogIndex, 0);
                return {
                    itog: acc.itog + itogSum,
                    index: acc.index + itogIndexSum,
                    allItog: acc.allItog + itogSum + itogIndexSum,
                };
            }, { itog: 0, index: 0, allItog: 0 });
        };

        itogs.totalAllItog.lider = calculateTotalAllItog(filteredLiderData);
        itogs.totalAllItog.monaco = calculateTotalAllItog(filteredMonacoData);
        itogs.totalAllItog.fenix = calculateTotalAllItog(filteredFenixData);
        itogs.totalAllItog.turan = calculateTotalAllItog(filteredTuranData);
        itogs.totalAllItog.fbox = calculateTotalAllItog(filteredNewOtdelData);
        itogs.totalAllItog.liberty = calculateTotalAllItog(filteredLibertyData);
        itogs.totalAllItog.allItogs = calculateTotalAllItog([
            ...filteredLiderData,
            ...filteredMonacoData,
            ...filteredFenixData,
            ...filteredTuranData,
            ...filteredNewOtdelData,
            ...filteredLibertyData
        ]);

        const allPercentIndex = (itogs.totalAllItog.lider.index + itogs.totalAllItog.monaco.index +
            itogs.totalAllItog.turan.index + itogs.totalAllItog.fenix.index + itogs.totalAllItog.fbox.index + itogs.totalAllItog.liberty.index);

        const allPercentComission = (itogs.totalAllItog.lider.itog + itogs.totalAllItog.monaco.itog +
            itogs.totalAllItog.fenix.itog + itogs.totalAllItog.turan.itog + itogs.totalAllItog.liberty.itog);

        itogs.totalAllItog.lider.percentIndex = ((itogs.totalAllItog.lider.index / allPercentIndex) * 100).toFixed(0);
        itogs.totalAllItog.monaco.percentIndex = ((itogs.totalAllItog.monaco.index / allPercentIndex) * 100).toFixed(0);
        itogs.totalAllItog.turan.percentIndex = ((itogs.totalAllItog.turan.index / allPercentIndex) * 100).toFixed(0);
        itogs.totalAllItog.fenix.percentIndex = ((itogs.totalAllItog.fenix.index / allPercentIndex) * 100).toFixed(0);
        itogs.totalAllItog.fbox.percentIndex = ((itogs.totalAllItog.fbox.index / allPercentIndex) * 100).toFixed(0);
        itogs.totalAllItog.liberty.percentIndex = ((itogs.totalAllItog.liberty.index / allPercentIndex) * 100).toFixed(0);
        itogs.totalAllItog.lider.percentItog = ((itogs.totalAllItog.lider.itog / allPercentComission) * 100).toFixed(0);
        itogs.totalAllItog.monaco.percentItog = ((itogs.totalAllItog.monaco.itog / allPercentComission) * 100).toFixed(0);
        itogs.totalAllItog.turan.percentItog = ((itogs.totalAllItog.turan.itog / allPercentComission) * 100).toFixed(0);
        itogs.totalAllItog.fenix.percentItog = ((itogs.totalAllItog.fenix.itog / allPercentComission) * 100).toFixed(0);
        itogs.totalAllItog.fbox.percentItog = ((itogs.totalAllItog.fbox.itog / allPercentComission) * 100).toFixed(0);
        itogs.totalAllItog.liberty.percentItog = ((itogs.totalAllItog.liberty.itog / allPercentComission) * 100).toFixed(0);

        const departments = [
            { name: 'Лидер', itog: itogs.totalAllItog.lider.itog },
            { name: 'Монако', itog: itogs.totalAllItog.monaco.itog },
            { name: 'Ильяс', itog: itogs.totalAllItog.fenix.itog },
            { name: 'Туран', itog: itogs.totalAllItog.turan.itog },
            { name: 'Ынтымак', itog: itogs.totalAllItog.fbox.itog },
            { name: 'liberty', itog: itogs.totalAllItog.liberty.itog }
        ];

        departments.sort((a, b) => b.itog - a.itog);

        const existingOtdelLink = await OtdelLink.findOne();
        if (!existingOtdelLink) {
            const otdelLink = new OtdelLink({
                clicked: 0,
                num1: {
                    _id: new mongoose.Types.ObjectId(),
                    click: 0,
                    otdel: departments[0].name,
                    link: ''
                },
                num2: {
                    _id: new mongoose.Types.ObjectId(),
                    click: 0,
                    otdel: departments[1].name,
                    link: ''
                },
                num3: {
                    _id: new mongoose.Types.ObjectId(),
                    click: 0,
                    otdel: departments[2].name,
                    link: ''
                },
                num4: {
                    _id: new mongoose.Types.ObjectId(),
                    click: 0,
                    otdel: departments[3].name,
                    link: ''
                },
                num5: {
                    _id: new mongoose.Types.ObjectId(),
                    click: 0,
                    otdel: departments[4].name,
                    link: ''
                },
                num6: {
                    _id: new mongoose.Types.ObjectId(),
                    click: 0,
                    otdel: departments[5].name,
                    link: ''
                }
            });

            await otdelLink.save();
        }

        cachedData = itogs;
    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
        throw error;
    }
}

const calcItogslast = async (req, res) => {
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

const getClickedDatas = async (req, res) => {
    try {
        const data = await OtdelLink.find();
        res.status(200).json(data);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export default { getClickedDatas, calcItogslast };
