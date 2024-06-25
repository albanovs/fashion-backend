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

        // Собираем все отделы с их кликами и ссылками
        let otdels = [];
        for (let i = 1; i <= 6; i++) {
            const num = data[`num${i}`];
            if (num && num.click > 0) {
                otdels.push(num);
            }
        }

        // Переходим к следующей ссылке в цикле
        data.lastClickedIndex = (data.lastClickedIndex + 1) % otdels.length;
        const nextLink = otdels[data.lastClickedIndex];

        // Увеличиваем счетчик кликов
        data.clicked++;

        // Обновляем ссылку
        data.link = nextLink.link;

        // Уменьшаем количество кликов у текущего отдела
        nextLink.click--;

        // Если отдел исчерпал свои клики, удаляем его из доступных
        if (nextLink.click === 0) {
            otdels = otdels.filter((_, index) => index !== data.lastClickedIndex);
            data.lastClickedIndex--;  // Корректируем индекс
        }

        // Если осталась только одна ссылка, начинаем заново
        if (otdels.length === 1) {
            for (let i = 1; i <= 6; i++) {
                const num = data[`num${i}`];
                if (num) {
                    num.click = data[`num${i}`].click;
                }
            }
            data.lastClickedIndex = 0;
        }

        await data.save();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export default { getClickedDatas, incrementClickedData };
