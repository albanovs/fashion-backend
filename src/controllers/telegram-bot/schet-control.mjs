import schetfakturaModel from "../../models/schet-factura/schet-faktura.mjs";
import schetfakturaLeaderModel from '../../models/schet-factura/leader-schet.mjs'
import schetfakturaMonacoModel from '../../models/schet-factura/monaco-schet.mjs'
import schetfakturaTuranModel from '../../models/schet-factura/turan-schet.mjs'
import schetfakturaLibertyModel from '../../models/schet-factura/liberty-schet.mjs'
import schetfakturaFenixModel from '../../models/schet-factura/ilyas-schet.mjs'
import schetfakturaYntymakModel from '../../models/schet-factura/yntymak-schet.mjs'

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

const updateSchetTeam = async () => {
    try {
        const data = await schetfakturaModel.find();
        for (const item of data) {
            switch (item.team) {
                case 'leader':
                    await schetfakturaLeaderModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    break;
                case 'monaco':
                    await schetfakturaMonacoModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    break;
                case 'turan':
                    await schetfakturaTuranModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    break;
                case 'liberty':
                    await schetfakturaLibertyModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    break;
                case 'ilyas':
                    await schetfakturaFenixModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
                    break;
                case 'yntymak':
                    await schetfakturaYntymakModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true });
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

export default { getSchetData, updateSchetData, updateSchetSumma, updateSchetTeam }