import OtdelLink from "../../models/otdel-link/otdel-link.mjs";

const getClickedDatas = async (req, res) => {
    try {
        const data = await OtdelLink.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

const incrementClickedData = async (req, res) => {
    try {
        const data = await OtdelLink.find();
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Нет данных" });
        }

        // Получаем текущее значение clicked
        let clicked = data[0].clicked;

        // Фильтруем объекты, которые участвуют в текущем цикле
        const activeItems = data.filter(item => item.click >= clicked);

        if (activeItems.length === 0) {
            // Если активных объектов нет, увеличиваем значение clicked и начинаем заново
            clicked++;
            await OtdelLink.updateMany({}, { clicked });
            return incrementClickedData(req, res); // Рекурсивно вызываем функцию
        }

        // Найдем текущий индекс и следующий объект для обновления
        const currentIndex = activeItems.findIndex(item => item.link === data[0].link);
        const nextIndex = (currentIndex + 1) % activeItems.length;
        const nextLink = activeItems[nextIndex].link;

        // Обновляем значение link и clicked
        await OtdelLink.updateMany({}, { link: nextLink, clicked });

        // Возвращаем обновленные данные
        const updatedData = await OtdelLink.find();
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export default { getClickedDatas, incrementClickedData };