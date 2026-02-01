import mongoose from "mongoose";
import cron from 'node-cron';
import ModelManagerRaiting from '../../models/rainting/managerrainting/manager.mjs';
import SimModelLider from '../../models/simcard/simlider.mjs';
import SimModelFenix from '../../models/simcard/simfenix.mjs';
import SimModelLiberty from '../../models/simcard/simliberty.mjs';
import SimModelMonaco from '../../models/simcard/simmonaco.mjs';
import SimModelTuran from '../../models/simcard/simturan.mjs';

import FenixDataModel from "../../models/fenix/fenixData.mjs";
import LibertyDataModel from "../../models/liberty/libertyData.mjs";
import MonacoDataModel from "../../models/monaco/monacoData.mjs";
import TuranDataModel from "../../models/turan/turanData.mjs";
import LiderDataModel from "../../models/lider/liderData.mjs";

const createMonthlyReport = async () => {
    try {
        const currentDate = new Date().toISOString().slice(0, 7);
        const existingReport = await ModelManagerRaiting.findOne({ datas: currentDate });

        if (existingReport) {
            console.log(`Документ с датой ${currentDate} уже существует.`);
            return;
        }

        const simModels = [
            { model: SimModelLider, teamName: 'Монако' },
            { model: SimModelFenix, teamName: 'Ильяс' },
            { model: SimModelTuran, teamName: 'Туран' }
        ];

        let managersArray = [];

        for (const { model: SimModel, teamName } of simModels) {
            const simData = await SimModel.find();

            simData.forEach(sim => {
                const manager = {
                    id_manager: sim._id,
                    otdel: teamName,
                    curator: sim.curator,
                    data_register: sim.data_register || 'до 09.05.2024',
                    buyerLength: sim.slot.filter(slot => slot.status === "2" && slot.buyer !== "").length,
                    totalcom: 0,
                    order: 0,
                    comission: 0,
                    comissionVM: 0,
                    allCoeff: '',
                    detail: sim.slot
                        .filter(slot => slot.status === "2" && slot.buyer !== "")
                        .map(slot => ({
                            name: slot.buyer,
                            status: slot.status,
                            orders: 0,
                            summa: 0,
                            team: teamName,
                            curator: sim.curator,
                            coeff: 0,
                            data_register: slot.data_register || 'до 09.05.2024'
                        })),
                    remainder: 0,
                    for_withdrawal: [],
                };

                if (manager.detail.length > 0) {
                    managersArray.push(manager);
                }
            });
        }

        const newRaiting = new ModelManagerRaiting({
            datas: currentDate,
            managers: managersArray
        });

        await newRaiting.save();
        console.log('Документ успешно создан');
    } catch (err) {
        console.error('Ошибка при создании документа:', err);
    }
};


const updateWithdrawal = async (req, res) => {
    const { managerId, summa } = req.body;
    try {
        const currentDate = new Date();
        const report = await ModelManagerRaiting.findOne({ "managers._id": managerId });
        if (!report) {
            console.error('Менеджер не найден');
            return;
        }
        const manager = report.managers.id(managerId);
        manager.for_withdrawal.push({
            summa: summa,
            date: currentDate
        });
        const totalWithdrawal = manager.for_withdrawal.reduce((acc, item) => acc + item.summa, 0);
        manager.remainder = manager.comission - totalWithdrawal;
        await report.save();
        res.status(200).json({ message: 'Вывод средств успешно обновлён' });
    } catch (err) {
        console.error('Ошибка при обновлении документа:', err);
    }
};


const updateDataFromDB = async () => {
    try {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

        const currentMonth = today.toISOString().slice(0, 7);
        // const currentMonth = '2025-08';
        const FenixManagers = await ModelManagerRaiting.find({ datas: currentMonth });
        let SelectedManagers = FenixManagers.map(elem => elem.managers).flat();

        // const [turanData, liderData, monacoData] = await Promise.all([
        //     TuranDataModel.find({ date: formattedDate }),
        //     LiderDataModel.find({ date: formattedDate }),
        //     FenixDataModel.find({ date: formattedDate })
        // ]);

        const curdata = '01.02.2026'

        const [turanData, liderData, monacoData] = await Promise.all([
            TuranDataModel.find({ date: curdata }),
            LiderDataModel.find({ date: curdata }),
            FenixDataModel.find({ date: curdata })
        ]);

        const combinedDataArray = [...turanData, ...liderData, ...monacoData];

        if (!combinedDataArray || combinedDataArray.length === 0) {
            console.log('Данные updateDataFromDB не найдены');
            return '❗️ Данные не найдены за ' + formattedDate;
        }

        let reportMessage = `📊 <b>Отчет за ${formattedDate}</b>\n\n`;

        for (const data of combinedDataArray) {
            for (let manager of SelectedManagers) {
                let totalOrdersForCurator = 0;
                let totalOrdersForDetails = 0;
                let totalSumForCurator = 0;
                let totalSumForDetails = 0;
                let totalComPersent100ForDetails = 0;
                let totalComPersent100ForDetailsAll = 0;

                const curatorOrders = data.otchet.filter(otchet =>
                    otchet.buyer.replace(/\s/g, '').toLowerCase() === manager.curator.replace(/\s/g, '').toLowerCase()
                );
                totalComPersent100ForDetailsAll += curatorOrders.reduce((sum, report) => sum + report.itog, 0);
                totalOrdersForCurator = curatorOrders.length;
                totalSumForCurator = curatorOrders.reduce((sum, report) => sum + report.itog, 0);

                manager.detail = manager.detail.map(detail => {
                    const matchingOrders = data.otchet.filter(otchet =>
                        otchet.buyer.replace(/\s/g, '').toLowerCase() === detail.name.replace(/\s/g, '').toLowerCase()
                    );

                    if (matchingOrders.length > 0) {
                        const totalMatchingSum = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        totalOrdersForDetails += matchingOrders.length;
                        totalSumForDetails += totalMatchingSum;

                        detail.summa = (detail.summa || 0) + totalMatchingSum;
                        detail.orders = (detail.orders || 0) + matchingOrders.length;
                        detail.coeff = (parseFloat(detail.coeff) || 0) + ((parseFloat(totalMatchingSum) / parseFloat(matchingOrders.length)).toFixed(0) / 1000).toFixed(2);

                        const comPersent100Sumall = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        const comPersent100Sum = matchingOrders.reduce((sum, report) => {
                            return report.sm === 1 ? sum + report.comPersent100 : sum;
                        }, 0);
                        totalComPersent100ForDetails += comPersent100Sum;
                        totalComPersent100ForDetailsAll += comPersent100Sumall;
                    }

                    return detail;
                });

                if (totalOrdersForCurator > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForCurator;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForCurator;
                }

                if (totalOrdersForDetails > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForDetails;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForDetails;
                }

                manager.comission = parseFloat((manager.comission || 0)) + Math.round(totalComPersent100ForDetails * 0.05);
                manager.remainder = parseFloat((manager.remainder || 0)) + Math.round(totalComPersent100ForDetails * 0.05);
                manager.comissionVM = parseFloat((manager.comission || 0)) + Math.round(totalComPersent100ForDetails * 0.05); //manager.curator.includes('ВМ') ? 0 : parseFloat((manager.comissionVM || 0)) + Math.round(totalComPersent100ForDetails * 0.05);
                manager.allCoeff = (parseFloat((manager.allCoeff || 0)) + (parseFloat((totalOrdersForCurator + totalOrdersForDetails)) / manager.buyerLength) + parseFloat((totalComPersent100ForDetailsAll / manager.buyerLength)) / 1000).toFixed(1);

                await ModelManagerRaiting.updateOne(
                    { 'managers._id': manager._id },
                    {
                        $set: {
                            'managers.$.detail': manager.detail,
                            'managers.$.totalcom': manager.totalcom,
                            'managers.$.order': manager.order,
                            'managers.$.comission': manager.comission,
                            'managers.$.comissionVM': manager.comissionVM,
                            'managers.$.remainder': manager.remainder,
                            'managers.$.allCoeff': manager.allCoeff
                        }
                    }
                );

                reportMessage += `👤 <b>${manager.curator}</b>\n`;
                reportMessage += `— кол-во байер: ${manager.buyerLength}\n`;
                reportMessage += `— Заказов: ${manager.order}\n`;
                reportMessage += `— Сумма: ${manager.totalcom} сом\n`;
                reportMessage += `— Комиссия: ${manager.comission} сом\n`;
                reportMessage += `— Коэфф: ${manager.allCoeff}\n`;

                if (manager.detail.length > 0) {
                    reportMessage += `   📌 <i>байеры:</i>\n`;
                    for (const detail of manager.detail) {
                        reportMessage += `   • ${detail.name}: ${detail.orders || 0} / ${detail.summa || 0} сом / коэфф: ${detail.coeff || 0}\n`;
                    }
                }

                reportMessage += `\n`;
            }
        }

        console.log('Обновление данных завершено');
        return reportMessage;
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
        return `❌ Ошибка обновления: ${error.message}`;
    }
};

// cron.schedule(
//     '0 22 * * *',
//     updateDataFromDB,
//     {
//         timezone: "Asia/Bishkek"
//     }
// );

// updateDataFromDB()

const updateDataFromDBFenix = async () => {
    try {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

        const currentMonth = today.toISOString().slice(0, 7);
        const FenixManagers = await ModelManagerRaiting.find({ datas: currentMonth });
        let SelectedManagers = FenixManagers.map(elem => elem.managers).flat();

        const liderData = await FenixDataModel.find({ date: formattedDate })



        if (!liderData || liderData.length === 0) {
            console.log('Данные updateDataFromDB не найдены');
            return;
        }

        for (const data of liderData) {
            for (let manager of SelectedManagers) {
                let totalOrdersForCurator = 0;
                let totalOrdersForDetails = 0;
                let totalSumForCurator = 0;
                let totalSumForDetails = 0;
                let totalComPersent100ForDetails = 0;
                let totalComPersent100ForDetailsAll = 0;

                const curatorOrders = data.otchet.filter(otchet =>
                    otchet.buyer.replace(/\s/g, '').toLowerCase() === manager.curator.replace(/\s/g, '').toLowerCase()
                );
                totalComPersent100ForDetailsAll += curatorOrders.reduce((sum, report) => sum + report.itog, 0);
                totalOrdersForCurator = curatorOrders.length;
                totalSumForCurator = curatorOrders.reduce((sum, report) => sum + report.itog, 0);

                manager.detail = manager.detail.map(detail => {

                    if (detail.status !== "2") {
                        return detail;
                    }

                    const matchingOrders = data.otchet.filter(otchet =>
                        otchet.buyer.replace(/\s/g, '').toLowerCase() === detail.name.replace(/\s/g, '').toLowerCase()
                    );

                    if (matchingOrders.length > 0) {
                        const totalMatchingSum = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        totalOrdersForDetails += matchingOrders.length;
                        totalSumForDetails += totalMatchingSum;

                        detail.summa = (detail.summa || 0) + totalMatchingSum;
                        detail.orders = (detail.orders || 0) + matchingOrders.length;
                        detail.coeff = (parseFloat(detail.coeff) || 0) + ((parseFloat(totalMatchingSum) / parseFloat(matchingOrders.length)).toFixed(0) / 1000).toFixed(2);

                        const comPersent100Sumall = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        const comPersent100Sum = matchingOrders.reduce((sum, report) => {
                            return report.sm === 1 ? sum + report.comPersent100 : sum;
                        }, 0);
                        totalComPersent100ForDetails += comPersent100Sum;
                        totalComPersent100ForDetailsAll += comPersent100Sumall;
                    }

                    return detail;
                });

                if (totalOrdersForCurator > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForCurator;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForCurator;
                }

                if (totalOrdersForDetails > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForDetails;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForDetails;
                }

                manager.comission = parseFloat((manager.comission || 0)) + Math.round(totalComPersent100ForDetails * 0.07);
                manager.remainder = parseFloat((manager.remainder || 0)) + Math.round(totalComPersent100ForDetails * 0.07);
                manager.comissionVM = manager.curator.includes('ВМ') ? 0 : parseFloat((manager.comissionVM || 0)) + Math.round(totalComPersent100ForDetails * 0.03);
                manager.allCoeff = (parseFloat((manager.allCoeff || 0)) + (parseFloat((totalOrdersForCurator + totalOrdersForDetails)) / manager.buyerLength) + parseFloat((totalComPersent100ForDetailsAll / manager.buyerLength)) / 1000).toFixed(1);

                await ModelManagerRaiting.updateOne(
                    { 'managers._id': manager._id },
                    {
                        $set: {
                            'managers.$.detail': manager.detail,
                            'managers.$.totalcom': manager.totalcom,
                            'managers.$.order': manager.order,
                            'managers.$.comission': manager.comission,
                            'managers.$.comissionVM': manager.comissionVM,
                            'managers.$.remainder': manager.remainder,
                            'managers.$.allCoeff': manager.allCoeff
                        }
                    }
                );
            }
        }

        console.log('Обновление ильяса данных завершено');
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
    }
};

const updateDataFromDBTuran = async () => {
    try {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

        const currentMonth = today.toISOString().slice(0, 7);
        const FenixManagers = await ModelManagerRaiting.find({ datas: currentMonth });
        let SelectedManagers = FenixManagers.map(elem => elem.managers).flat();

        const liderData = await TuranDataModel.find({ date: formattedDate })



        if (!liderData || liderData.length === 0) {
            console.log('Данные updateDataFromDB не найдены');
            return;
        }

        for (const data of liderData) {
            for (let manager of SelectedManagers) {
                let totalOrdersForCurator = 0;
                let totalOrdersForDetails = 0;
                let totalSumForCurator = 0;
                let totalSumForDetails = 0;
                let totalComPersent100ForDetails = 0;
                let totalComPersent100ForDetailsAll = 0;

                const curatorOrders = data.otchet.filter(otchet =>
                    otchet.buyer.replace(/\s/g, '').toLowerCase() === manager.curator.replace(/\s/g, '').toLowerCase()
                );
                totalComPersent100ForDetailsAll += curatorOrders.reduce((sum, report) => sum + report.itog, 0);
                totalOrdersForCurator = curatorOrders.length;
                totalSumForCurator = curatorOrders.reduce((sum, report) => sum + report.itog, 0);

                manager.detail = manager.detail.map(detail => {

                    if (detail.status !== "2") {
                        return detail;
                    }

                    const matchingOrders = data.otchet.filter(otchet =>
                        otchet.buyer.replace(/\s/g, '').toLowerCase() === detail.name.replace(/\s/g, '').toLowerCase()
                    );

                    if (matchingOrders.length > 0) {
                        const totalMatchingSum = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        totalOrdersForDetails += matchingOrders.length;
                        totalSumForDetails += totalMatchingSum;

                        detail.summa = (detail.summa || 0) + totalMatchingSum;
                        detail.orders = (detail.orders || 0) + matchingOrders.length;
                        detail.coeff = (parseFloat(detail.coeff) || 0) + ((parseFloat(totalMatchingSum) / parseFloat(matchingOrders.length)).toFixed(0) / 1000).toFixed(2);

                        const comPersent100Sumall = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        const comPersent100Sum = matchingOrders.reduce((sum, report) => {
                            return report.sm === 1 ? sum + report.comPersent100 : sum;
                        }, 0);
                        totalComPersent100ForDetails += comPersent100Sum;
                        totalComPersent100ForDetailsAll += comPersent100Sumall;
                    }

                    return detail;
                });

                if (totalOrdersForCurator > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForCurator;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForCurator;
                }

                if (totalOrdersForDetails > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForDetails;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForDetails;
                }

                manager.comission = parseFloat((manager.comission || 0)) + Math.round(totalComPersent100ForDetails * 0.07);
                manager.remainder = parseFloat((manager.remainder || 0)) + Math.round(totalComPersent100ForDetails * 0.07);
                manager.comissionVM = manager.curator.includes('ВМ') ? 0 : parseFloat((manager.comissionVM || 0)) + Math.round(totalComPersent100ForDetails * 0.03);
                manager.allCoeff = (parseFloat((manager.allCoeff || 0)) + (parseFloat((totalOrdersForCurator + totalOrdersForDetails)) / manager.buyerLength) + parseFloat((totalComPersent100ForDetailsAll / manager.buyerLength)) / 1000).toFixed(1);

                await ModelManagerRaiting.updateOne(
                    { 'managers._id': manager._id },
                    {
                        $set: {
                            'managers.$.detail': manager.detail,
                            'managers.$.totalcom': manager.totalcom,
                            'managers.$.order': manager.order,
                            'managers.$.comission': manager.comission,
                            'managers.$.comissionVM': manager.comissionVM,
                            'managers.$.remainder': manager.remainder,
                            'managers.$.allCoeff': manager.allCoeff
                        }
                    }
                );
            }
        }

        console.log('Обновление турана данных завершено');
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
    }
};

const updateDataFromDBMonaco = async () => {
    try {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

        const currentMonth = today.toISOString().slice(0, 7);
        const FenixManagers = await ModelManagerRaiting.find({ datas: currentMonth });
        let SelectedManagers = FenixManagers.map(elem => elem.managers).flat();

        const liderData = await LiderDataModel.find({ date: formattedDate });



        if (!liderData || liderData.length === 0) {
            console.log('Данные updateDataFromDB не найдены');
            return;
        }

        for (const data of liderData) {
            for (let manager of SelectedManagers) {
                let totalOrdersForCurator = 0;
                let totalOrdersForDetails = 0;
                let totalSumForCurator = 0;
                let totalSumForDetails = 0;
                let totalComPersent100ForDetails = 0;
                let totalComPersent100ForDetailsAll = 0;

                const curatorOrders = data.otchet.filter(otchet =>
                    otchet.buyer.replace(/\s/g, '').toLowerCase() === manager.curator.replace(/\s/g, '').toLowerCase()
                );
                totalComPersent100ForDetailsAll += curatorOrders.reduce((sum, report) => sum + report.itog, 0);
                totalOrdersForCurator = curatorOrders.length;
                totalSumForCurator = curatorOrders.reduce((sum, report) => sum + report.itog, 0);

                manager.detail = manager.detail.map(detail => {

                    if (detail.status !== "2") {
                        return detail;
                    }

                    const matchingOrders = data.otchet.filter(otchet =>
                        otchet.buyer.replace(/\s/g, '').toLowerCase() === detail.name.replace(/\s/g, '').toLowerCase()
                    );

                    if (matchingOrders.length > 0) {
                        const totalMatchingSum = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        totalOrdersForDetails += matchingOrders.length;
                        totalSumForDetails += totalMatchingSum;

                        detail.summa = (detail.summa || 0) + totalMatchingSum;
                        detail.orders = (detail.orders || 0) + matchingOrders.length;
                        detail.coeff = (parseFloat(detail.coeff) || 0) + ((parseFloat(totalMatchingSum) / parseFloat(matchingOrders.length)).toFixed(0) / 1000).toFixed(2);

                        const comPersent100Sumall = matchingOrders.reduce((sum, report) => sum + report.itog, 0);
                        const comPersent100Sum = matchingOrders.reduce((sum, report) => {
                            return report.sm === 1 ? sum + report.comPersent100 : sum;
                        }, 0);
                        totalComPersent100ForDetails += comPersent100Sum;
                        totalComPersent100ForDetailsAll += comPersent100Sumall;
                    }

                    return detail;
                });

                if (totalOrdersForCurator > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForCurator;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForCurator;
                }

                if (totalOrdersForDetails > 0) {
                    manager.order = (manager.order || 0) + totalOrdersForDetails;
                    manager.totalcom = (manager.totalcom || 0) + totalSumForDetails;
                }

                manager.comission = parseFloat((manager.comission || 0)) + Math.round(totalComPersent100ForDetails * 0.07);
                manager.remainder = parseFloat((manager.remainder || 0)) + Math.round(totalComPersent100ForDetails * 0.07);
                manager.comissionVM = manager.curator.includes('ВМ') ? 0 : parseFloat((manager.comissionVM || 0)) + Math.round(totalComPersent100ForDetails * 0.03);
                manager.allCoeff = (parseFloat((manager.allCoeff || 0)) + (parseFloat((totalOrdersForCurator + totalOrdersForDetails)) / manager.buyerLength) + parseFloat((totalComPersent100ForDetailsAll / manager.buyerLength)) / 1000).toFixed(1);

                await ModelManagerRaiting.updateOne(
                    { 'managers._id': manager._id },
                    {
                        $set: {
                            'managers.$.detail': manager.detail,
                            'managers.$.totalcom': manager.totalcom,
                            'managers.$.order': manager.order,
                            'managers.$.comission': manager.comission,
                            'managers.$.comissionVM': manager.comissionVM,
                            'managers.$.remainder': manager.remainder,
                            'managers.$.allCoeff': manager.allCoeff
                        }
                    }
                );
            }
        }

        console.log('Обновление ильяса данных завершено');
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
    }
};

// updateDataFromDBMonaco();

// updateDataFromDBlocal();

const getBuyerRaiting = async (req, res) => {
    try {
        const currentDate = new Date().toISOString().slice(0, 7);
        const managers = await ModelManagerRaiting.find({ datas: currentDate });
        const allDetails = [];

        managers.forEach(manager => {
            manager.managers.forEach(manager => {
                allDetails.push(...manager.detail);
            })
        });
        allDetails.sort((a, b) => b.summa - a.summa);
        res.status(200).json(allDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Что-то пошло не так" });
    }
};

const getAllManagers = async (req, res) => {
    try {
        const managers = await ModelManagerRaiting.find();
        res.status(200).json(managers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Что-то пошло не так" });
    }
};

export default { createMonthlyReport, updateDataFromDBFenix, updateDataFromDB, updateDataFromDBMonaco, updateDataFromDBTuran, updateWithdrawal, getAllManagers, getBuyerRaiting };