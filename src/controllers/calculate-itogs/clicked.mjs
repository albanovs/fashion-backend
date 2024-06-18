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

        data.clicked += 1;

        let totalClicksSum = 0;
        for (let i = 1; i <= 6; i++) {
            totalClicksSum += data[`num${i}`].click;
        }

        if (data.clicked > totalClicksSum) {
            data.clicked = 1;
        }

        let totalClicks = 0;
        let newLink = "";

        for (let i = 1; i <= 6; i++) {
            totalClicks += data[`num${i}`].click;
            if (data.clicked <= totalClicks) {
                newLink = data[`num${i}`].link;
                break;
            }
        }

        data.link = newLink;
        await data.save();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export default { getClickedDatas, incrementClickedData };
