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
        const updatedData = await OtdelLink.findByIdAndUpdate(
            id,
            { $inc: { clicked: 1 } },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({
                error: "Документ не найден",
            });
        }

        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так",
        });
    }
};

export { getClickedDatas, incrementClickedData };
