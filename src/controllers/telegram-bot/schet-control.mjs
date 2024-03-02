import schetfakturaModel from "../../models/schet-factura/schet-faktura.mjs";


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
const updateSchetData = async () => {
    try {
        const data = await schetfakturaModel.find();
        for (const item of data) {
            // Обновляем значение поля 'budjet' (perevod * curs)
            item.budjet = item.perevod * item.curs;

            // Обходим каждый элемент массива 'position' и вычисляем сумму (count * price)
            let summaTotal = 0;
            for (const position of item.position) {
                position.summa = position.count * position.price;
                summaTotal += position.summa;
            }

            // Вычисляем комиссию (сумма всех summa * 0.06)
            item.comission = summaTotal * 0.06;

            // Добавляем комиссию к итоговой сумме
            item.itogs = summaTotal + item.comission;

            // Сохраняем обновленные данные
            await item.save();
        }
        console.log('Данные успешно обновлены.');
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
    }
}

export default { getSchetData, updateSchetData }