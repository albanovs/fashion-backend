import Test from "../../models/test/test.mjs";

const changeData = async (req, res) => {
    const { id } = req.params;
    const { username, description } = req.body

    try {
        const existingExpense = await Test.findById(id);
        existingExpense.username = username
        existingExpense.description = description

        await existingExpense.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.sendStatus(500);
    }
};

const postData = async (req, res) => {
    const { username, description } = req.body

    try {
        const existingExpense = new Test({
            username: username,
            description: description
        })
        await existingExpense.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.sendStatus(500);
    }
};

const deleteDatas = async (req, res) => {
    const { id } = req.params;
    try {
        const existingExpense = await Test.findByIdAndDelete(id);
        await existingExpense.save();
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.sendStatus(500);
    }
};

const getDataTest = async (req, res) => {
    try {
        const data = await Test.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}



export default { changeData, getDataTest, postData, getDataTest, deleteDatas };