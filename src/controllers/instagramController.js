import MyModel from "../models/MyModel.js";

export const addInstagramSlot = async (req, res) => {
    try {
        const { account, num } = req.body;
        const myData = new MyModel({ account, num });
        await myData.save();
        res.status(200).json({ message: 'Данные успешно добавлены' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};

export const updateInstagramSlot = async (req, res) => {
    const { id } = req.params;
    const { monako, lider, fenix, turan } = req.body;

    try {
        const updatedMyModel = await MyModel.findByIdAndUpdate(
            id,
            { monako, lider, fenix, turan },
            { new: true }
        );
        res.json(updatedMyModel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

export const createInstagramSlots = async (req, res) => {
    try {
        for (var i = 1; i <= 5; i++) {
            const myData = new MyModel({
                'account': req.body.account,
                'num': i,
                'monako': '',
                'fenix': '',
                'lider': '',
                'turan': '',
            });
            await myData.save()
        }
        res.status(200).json({ massage: `${JSON.stringify(myData)}` });

    } catch (error) {
        res.status(500).json({ error: 'что то пошло не так!' });
    }
};

export const getInstagramSlots =  async (req, res) => {
    try {
        const data = await MyModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Что то пошло не так'
        })
    }
};