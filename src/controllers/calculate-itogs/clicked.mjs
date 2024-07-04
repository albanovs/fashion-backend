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

        if (data.lastClickedIndex === undefined) {
            data.lastClickedIndex = 0;
        }

        let otdels = [];
        for (let i = 1; i <= 6; i++) {
            const num = data[`num${i}`];
            if (num) {
                otdels.push({ ...num, originalIndex: i });
            }
        }
        otdels = otdels.filter(num => num.click > data.clicked);
        if (otdels.length === 0) {
            data.clicked = 0;
            for (let i = 1; i <= 6; i++) {
                const num = data[`num${i}`];
                if (num) {
                    otdels.push({ ...num, originalIndex: i });
                }
            }
        }
        data.lastClickedIndex = (data.lastClickedIndex + 1) % otdels.length;
        const nextLink = otdels[data.lastClickedIndex];
        data.clicked++;
        data.link = nextLink.link;
        await data.save();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export default { getClickedDatas, incrementClickedData };