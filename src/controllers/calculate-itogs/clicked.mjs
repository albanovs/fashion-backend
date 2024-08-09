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

// const incrementClickedData = async (req, res) => {
//     const { id } = req.body;

//     try {
//         const data = await OtdelLink.findById(id);
//         if (!data) {
//             return res.status(404).json({
//                 error: "Документ не найден",
//             });
//         }

//         // Создание массива ссылок с учетом количества кликов
//         let linkArray = [];
//         for (let i = 1; i <= 5; i++) { // num1, num2, ..., num6
//             const num = data[`num${i}`];
//             if (num) {
//                 for (let j = 0; j < num.click; j++) {
//                     linkArray.push(num.link);
//                 }
//             }
//         }

//         // Перемешивание массива ссылок
//         linkArray = linkArray.sort(() => Math.random() - 0.5);

//         // Проверка, что размер linkArray не равен нулю
//         if (linkArray.length === 0) {
//             return res.status(400).json({ error: "Нет доступных ссылок для обновления документа" });
//         }

//         // Увеличиваем индекс и берем по модулю длины массива
//         data.lastClickedIndex = (data.lastClickedIndex + 1) % linkArray.length;

//         // Обновление основного поля link в документе
//         data.link = linkArray[data.lastClickedIndex];

//         await data.save();

//         res.status(200).json(data);
//     } catch (error) {
//         console.error("Ошибка в incrementClickedData:", error);
//         res.status(500).json({
//             error: "Что-то пошло не так",
//         });
//     }
// };

const incrementClickedData = async (req, res) => {
    try {
        const otdelLinks = await OtdelLink.find();

        for (const otdelLink of otdelLinks) {
            let nextIndex = (otdelLink.lastClickedIndex + 1) % 5;

            const nextLink = otdelLink[`num${nextIndex + 1}`].link;
            await OtdelLink.updateOne(
                { _id: otdelLink._id },
                {
                    $set: { link: nextLink, lastClickedIndex: nextIndex },
                }
            );
        }

        res.status(200).json({ message: "Links updated successfully" });
    } catch (error) {
        res.status(500).json({
            error: "Something went wrong",
        });
    }
};

export default { getClickedDatas, incrementClickedData };
