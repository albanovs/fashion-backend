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
    const { id } = req.body;

    try {
        // Находим документ по id
        const data = await OtdelLink.findById(id);

        if (!data) {
            return res.status(404).json({
                error: "Документ не найден",
            });
        }

        // Если lastClickedIndex не определен или дошел до 1, устанавливаем его в 0 и увеличиваем clicked
        if (data.lastClickedIndex === undefined || data.lastClickedIndex === 4) {
            data.clicked = (data.clicked + 1) % 5; // Увеличиваем clicked и берем по модулю 7
            data.lastClickedIndex = 0;
        } else {
            // Иначе увеличиваем lastClickedIndex
            data.lastClickedIndex++;
        }

        // Собираем все отделы с их кликами и ссылками
        let otdels = [];
        for (let i = 1; i <= 5; i++) {
            const num = data[`num${i}`];
            if (num && num.click >= data.clicked) { // Проверяем клики
                otdels.push({ ...num, originalIndex: i });
            }
        }

        // Если есть активные отделы, обновляем ссылку на следующую
        if (otdels.length > 0) {
            // Обновляем lastClickedIndex по модулю длины массива otdels
            data.lastClickedIndex = data.lastClickedIndex % otdels.length;
            data.link = otdels[data.lastClickedIndex].link;
        } else {
            console.log("No more links to click.");
            // Можно добавить логику для обнуления ссылки или других действий, если отделы закончились
        }

        // Сохраняем обновленные данные в базе данных
        await data.save();
        
        res.status(200).json(data);
    } catch (error) {
        console.error("Ошибка в incrementClickedData:", error);
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export default { getClickedDatas, incrementClickedData };