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
        const data = await OtdelLink.findById(id);

        if (!data) {
            return res.status(404).json({
                error: "Документ не найден",
            });
        }

        if (!data.lastClickedIndex) {
            data.lastClickedIndex = 0;  // Инициализируем, если не существует
        }

        let availableLinks = [];

        // Собираем все доступные ссылки
        for (let i = 1; i <= 6; i++) {
            if (data[`num${i}`]) {
                availableLinks.push(data[`num${i}`]);
            }
        }

        // Переходим к следующей ссылке в цикле
        data.lastClickedIndex = (data.lastClickedIndex + 1) % availableLinks.length;
        const nextLink = availableLinks[data.lastClickedIndex];

        // Увеличиваем счетчик кликов
        nextLink.click++;

        // Если ссылка достигла максимального количества кликов, удаляем ее
        if (nextLink.click >= data.clicked) {
            availableLinks.splice(data.lastClickedIndex, 1);
            data.lastClickedIndex--;  // Корректируем индекс
        }

        // Если осталась только одна ссылка, начинаем заново
        if (availableLinks.length === 1) {
            for (let i = 1; i <= 6; i++) {
                if (data[`num${i}`]) {
                    data[`num${i}`].click = 0;
                }
            }
            data.lastClickedIndex = 0;
        }

        // Обновляем ссылку
        data.link = availableLinks[data.lastClickedIndex].link;
        await data.save();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export default { getClickedDatas, incrementClickedData };