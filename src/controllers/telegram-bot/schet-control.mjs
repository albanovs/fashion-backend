import schetfakturaModel from "../../models/schet-factura/schet-faktura.mjs";
import schetfakturaLeaderModel from '../../models/schet-factura/leader-schet.mjs'
import schetfakturaMonacoModel from '../../models/schet-factura/monaco-schet.mjs'
import schetfakturaTuranModel from '../../models/schet-factura/turan-schet.mjs'
import schetfakturaLibertyModel from '../../models/schet-factura/liberty-schet.mjs'
import schetfakturaFenixModel from '../../models/schet-factura/ilyas-schet.mjs'
import schetfakturaYntymakModel from '../../models/schet-factura/yntymak-schet.mjs'
import monacoOtchetBetaModel from "../../models/monaco/monacoOtchetBeta.mjs";
import fenixOtchetBetaModel from "../../models/fenix/fenixOtchetBeta.mjs";
import TuranOtchetBetaModel from "../../models/turan/turanOtchetBeta.mjs";
import liderOtchetBetaModel from "../../models/lider/liderOtchetBeta.mjs";
import newOtdelOtchetBetaModel from "../../models/new-otel/newOtdelOtchetBeta.mjs";
import libertyOtchetBetaModel from "../../models/liberty/libertyOtchetBeta.mjs";

const getSchetData = async (req, res) => {
    try {
        const data = await schetfakturaModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getSchetDataleader = async (req, res) => {
    try {
        const data = await schetfakturaLeaderModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getSchetDatamonaco = async (req, res) => {
    try {
        const data = await schetfakturaMonacoModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getSchetDataturan = async (req, res) => {
    try {
        const data = await schetfakturaTuranModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getSchetDatafenix = async (req, res) => {
    try {
        const data = await schetfakturaFenixModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getSchetDataliberty = async (req, res) => {
    try {
        const data = await schetfakturaLibertyModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

const getSchetDatafbox = async (req, res) => {
    try {
        const data = await schetfakturaYntymakModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}


const updateSchetTeam = async () => {
    try {
        const data = await schetfakturaModel.find();
        for (const item of data) {
            switch (item.team) {
                case 'leader':
                    await schetfakturaLeaderModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    const dataotchet = await liderOtchetBetaModel.find();
                    if (dataotchet.length > 0) {
                        const firstItem = dataotchet[0];
                        if (firstItem.otchet && firstItem.otchet.length > 0) {
                            for (const obj of firstItem.otchet) {
                                if (!obj.sity && !obj.admin && !obj.comPersent100) {
                                    obj.sity = `${item.FIO} ${item.city}`;
                                    obj.admin = item.admin;
                                    obj.buyer = item.manager;
                                    obj.comPersent100 = item.comission;
                                }
                            }
                            await firstItem.save();
                        } else {
                            console.error('В liderOtchetBetaModel нет массива otchet или он пустой');
                        }
                    } else {
                        console.error('Не найдены данные в liderOtchetBetaModel');
                    }
                    break;

                case 'monaco':
                    await schetfakturaMonacoModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    const dataotchetmonaco = await monacoOtchetBetaModel.find();
                    if (dataotchet.length > 0) {
                        const firstItem = dataotchetmonaco[0];
                        if (firstItem.otchet && firstItem.otchet.length > 0) {
                            for (const obj of firstItem.otchet) {
                                if (!obj.sity && !obj.admin && !obj.comPersent100) {
                                    obj.sity = `${item.FIO} ${item.city}`;
                                    obj.admin = item.admin;
                                    obj.buyer = item.manager;
                                    obj.comPersent100 = item.comission;
                                }
                            }
                            await firstItem.save();
                        } else {
                            console.error('В monaco нет массива otchet или он пустой');
                        }
                    } else {
                        console.error('Не найдены данные в monaco');
                    }
                    break;
                case 'turan':
                    await schetfakturaTuranModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    const dataotchetturan = await TuranOtchetBetaModel.find();
                    if (dataotchet.length > 0) {
                        const firstItem = dataotchetturan[0];
                        if (firstItem.otchet && firstItem.otchet.length > 0) {
                            for (const obj of firstItem.otchet) {
                                if (!obj.sity && !obj.admin && !obj.comPersent100) {
                                    obj.sity = `${item.FIO} ${item.city}`;
                                    obj.admin = item.admin;
                                    obj.buyer = item.manager;
                                    obj.comPersent100 = item.comission;
                                }
                            }
                            await firstItem.save();
                        } else {
                            console.error('В turan нет массива otchet или он пустой');
                        }
                    } else {
                        console.error('Не найдены данные в turan');
                    }
                    break;
                case 'liberty':
                    await schetfakturaLibertyModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    const dataotchetliberty = await libertyOtchetBetaModel.find();
                    if (dataotchet.length > 0) {
                        const firstItem = dataotchetliberty[0];
                        if (firstItem.otchet && firstItem.otchet.length > 0) {
                            for (const obj of firstItem.otchet) {
                                if (!obj.sity && !obj.admin && !obj.comPersent100) {
                                    obj.sity = `${item.FIO} ${item.city}`;
                                    obj.admin = item.admin;
                                    obj.buyer = item.manager;
                                    obj.comPersent100 = item.comission;
                                }
                            }
                            await firstItem.save();
                        } else {
                            console.error('В turan нет массива otchet или он пустой');
                        }
                    } else {
                        console.error('Не найдены данные в turan');
                    }
                    break;
                case 'ilyas':
                    await schetfakturaFenixModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    const dataotchetfenix = await fenixOtchetBetaModel.find();
                    if (dataotchet.length > 0) {
                        const firstItem = dataotchetfenix[0];
                        if (firstItem.otchet && firstItem.otchet.length > 0) {
                            for (const obj of firstItem.otchet) {
                                if (!obj.sity && !obj.admin && !obj.comPersent100) {
                                    obj.sity = `${item.FIO} ${item.city}`;
                                    obj.admin = item.admin;
                                    obj.buyer = item.manager;
                                    obj.comPersent100 = item.comission;
                                }
                            }
                            await firstItem.save();
                        } else {
                            console.error('В turan нет массива otchet или он пустой');
                        }
                    } else {
                        console.error('Не найдены данные в turan');
                    }
                    break;
                case 'yntymak':
                    await schetfakturaYntymakModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    const dataotchetfbox = await newOtdelOtchetBetaModel.find();
                    if (dataotchet.length > 0) {
                        const firstItem = dataotchetfbox[0];
                        if (firstItem.otchet && firstItem.otchet.length > 0) {
                            for (const obj of firstItem.otchet) {
                                if (!obj.sity && !obj.admin && !obj.comPersent100) {
                                    obj.sity = `${item.FIO} ${item.city}`;
                                    obj.admin = item.admin;
                                    obj.buyer = item.manager;
                                    obj.comPersent100 = item.comission;
                                }
                            }
                            await firstItem.save();
                        } else {
                            console.error('В turan нет массива otchet или он пустой');
                        }
                    } else {
                        console.error('Не найдены данные в turan');
                    }
                    break;
                default:
                    console.error('Неизвестное значение team:', item.team);
                    break;
            }
            await schetfakturaModel.deleteOne({ _id: item._id });
        }
    } catch (error) {
        console.error('Ошибка при обновлении данных по командам:', error);
    }
}


const updateSchetData = async () => {
    try {
        const data = await schetfakturaModel.find();
        for (const item of data) {
            let summaTotal = 0;
            for (const position of item.position) {
                summaTotal += position.summa;
            }
            item.comission = summaTotal * 0.06;
            item.all_sum = summaTotal
            item.itogs = summaTotal + item.comission;
            item.balans = item.budjet - (summaTotal + item.comission)
            await item.save();
        }
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
    }
}

const updateSchetSumma = async () => {
    try {
        const data = await schetfakturaModel.find();
        for (const item of data) {
            let summaTotal = 0;
            for (const stransfer of item.transfer) {
                summaTotal += parseFloat(stransfer.summa);
            }
            item.budjet = parseFloat(summaTotal).toFixed(0)
            await item.save();
        }
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
    }
}

export default { getSchetData, updateSchetData, updateSchetSumma, updateSchetTeam, getSchetDatafbox, getSchetDatafenix, getSchetDataleader, getSchetDataliberty, getSchetDatamonaco, getSchetDataturan }