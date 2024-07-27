import LiderDataModel from "../../models/lider/liderData.mjs";
import MonacoDataModel from "../../models/monaco/monacoData.mjs";
import FenixDataModel from "../../models/fenix/fenixData.mjs";
import TuranDataModel from "../../models/turan/turanData.mjs";
import LibertyDataModel from "../../models/liberty/libertyData.mjs";
import NewOtdelDataModel from "../../models/new-otel/newOtdelData.mjs";
import OtdelLink from "../../models/otdel-link/otdel-link.mjs";
import cron from 'node-cron'

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
            lider: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            monaco: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            fenix: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            turan: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            fbox: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            liberty: {
                itog: 0,
                index: 0,
                allItog: 0,
                percentItog: 0,
                percentIndex: 0,
            },
            allItogs: {
                itog: 0,
                itogIndex: 0,
                allItog: 0,
            },
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

        const filterDataByLastWeek = (data) => {
            const currentDate = new Date();
            const lastWeekDate = new Date();
            lastWeekDate.setDate(currentDate.getDate() - 7);

            return data.filter((item) => {
                const [itemDay, itemMonth, itemYear] = item.date.split('.');
                const itemDate = new Date(`${itemYear}-${itemMonth}-${itemDay}`);
                return itemDate >= lastWeekDate && itemDate <= currentDate;
            });
        };

        const filteredLiderData = filterDataByLastWeek(liderData);
        const filteredMonacoData = filterDataByLastWeek(monacoData);
        const filteredFenixData = filterDataByLastWeek(fenixData);
        const filteredTuranData = filterDataByLastWeek(turanData);
        const filteredNewOtdelData = filterDataByLastWeek(newOtdelData);
        const filteredLibertyData = filterDataByLastWeek(libertyData);

        itogs.otdel.lider = filteredLiderData;
        itogs.otdel.monaco = filteredMonacoData;
        itogs.otdel.fenix = filteredFenixData;
        itogs.otdel.turan = filteredTuranData;
        itogs.otdel.fbox = filteredNewOtdelData;
        itogs.otdel.liberty = filteredLibertyData;

        const calculateTotalAllItog = (data) => {
            return data.reduce((acc, elem) => {
                const itogSum = elem.itog.reduce((subAcc, item) => {
                    return subAcc + item.allItog;
                }, 0);
                const itogIndexSum = elem.itog.reduce((subAcc, item) => {
                    return subAcc + item.allItogIndex;
                }, 0);
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

        const allPercentIndex = (
            itogs.totalAllItog.lider.index +
            itogs.totalAllItog.monaco.index +
            itogs.totalAllItog.turan.index +
            itogs.totalAllItog.fenix.index +
            itogs.totalAllItog.fbox.index +
            itogs.totalAllItog.liberty.index
        );

        const allPercentComission = (
            itogs.totalAllItog.lider.itog +
            itogs.totalAllItog.monaco.itog +
            itogs.totalAllItog.fenix.itog +
            itogs.totalAllItog.turan.itog +
            itogs.totalAllItog.liberty.itog
        );

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
            { name: 'Лидер', itog: itogs.totalAllItog.lider.itog, link: 'https://chat.whatsapp.com/CLPNpgrJZykA4T5w6SimCP' },
            { name: 'Монако', itog: itogs.totalAllItog.monaco.itog, link: 'https://chat.whatsapp.com/KPuKEVKaTGX6Ap6zB7kMgo' },
            { name: 'Ильяс', itog: itogs.totalAllItog.fenix.itog, link: 'https://chat.whatsapp.com/KPuKEVKaTGX6Ap6zB7kMgo' },
            { name: 'Туран', itog: itogs.totalAllItog.turan.itog, link: 'https://chat.whatsapp.com/IHt6E3FdfVc3gvdmtVyxQt' },
            { name: 'liberty', itog: itogs.totalAllItog.liberty.itog, link: 'https://chat.whatsapp.com/KqXYzjEAX5p2xOR88MOYtt' }
        ];

        departments.sort((a, b) => b.itog - a.itog);

        const existingOtdelLink = await OtdelLink.findOne();
        if (existingOtdelLink) {
            existingOtdelLink.num1.otdel = departments[0].name;
            existingOtdelLink.num1.link = departments[0].link;
            existingOtdelLink.num2.otdel = departments[1].name;
            existingOtdelLink.num2.link = departments[1].link;
            existingOtdelLink.num3.otdel = departments[2].name;
            existingOtdelLink.num3.link = departments[2].link;
            existingOtdelLink.num4.otdel = departments[3].name;
            existingOtdelLink.num4.link = departments[3].link;
            existingOtdelLink.num5.otdel = departments[4].name;
            existingOtdelLink.num5.link = departments[4].link;
            await existingOtdelLink.save();
        } else {
            const otdelLink = new OtdelLink({
                clicked: 0,
                link: departments[0].link,
                lastClickedIndex: 0,
                num1: {
                    click: 5,
                    otdel: departments[0].name,
                    link: departments[0].link
                },
                num2: {
                    click: 4,
                    otdel: departments[1].name,
                    link: departments[1].link
                },
                num3: {
                    click: 3,
                    otdel: departments[2].name,
                    link: departments[2].link
                },
                num4: {
                    click: 2,
                    otdel: departments[3].name,
                    link: departments[3].link
                },
                num5: {
                    click: 1,
                    otdel: departments[4].name,
                    link: departments[4].link
                },
            });

            await otdelLink.save();
        }

        return itogs;

    } catch (error) {
        console.error('Ошибка при выполнении вычислений:', error);
    }
}

async function calculateAndCacheDataCash() {
    const result = await calculateAndCacheData();
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

export default { calcItogslast };