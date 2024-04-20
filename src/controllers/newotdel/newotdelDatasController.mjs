import ExpensesModel from "../../models/expences/expences.mjs";
import NewOtdelDataModel from "../../models/new-otel/newOtdelData.mjs";

const createNewOtdelData = async (req, res) => {
    const { date, otchet, itog } = req.body;

    try {

        const existingExpense = await ExpensesModel.findOne({ "departmentExpenses.expenses": { $elemMatch: { date: date } } });

        if (existingExpense) {
            existingExpense.departmentExpenses.forEach(department => {
                if (department.names === "ынтымак") {
                    const foundExpense = department.expenses.find(expense => expense.date === date);
                    if (foundExpense) {
                        const index = department.expenses.indexOf(foundExpense);
                        if (index !== -1) {
                            department.expenses[index].amount = itog[0].itogs;
                        }
                    }
                }
            });
            await existingExpense.save();
        } else {
            console.error('Расход для указанной даты не найден');
        }

        const data = {
            date: date,
            otchet: otchet.map((elem) => ({
                _id: elem._id,
                sm: elem.sm,
                date: elem.date,
                sity: elem.sity,
                admin: elem.admin,
                buyer: elem.buyer,
                comPersent100: elem.comPersent100,
                comPersent2: elem.comPersent2,
                comPersent3: elem.comPersent3,
                comPersent4: elem.comPersent4,
                indexPersent100: elem.indexPersent100,
                indexPersent2: elem.indexPersent2,
                indexPersent3: elem.indexPersent3,
                indexPersent4: elem.indexPersent4,
                uhod: elem.uhod,
                prihod: elem.prihod,
                itog: elem.itog,
                itogIndex: elem.itogIndex,
            })),

            itog: itog.map((elem) => ({
                _id: elem._id,
                date: elem.date,
                ros1: elem.ros1,
                ros2: elem.ros2,
                ros3: elem.ros3,
                ros4: elem.ros4,
                ros5: elem.ros5,
                ros6: elem.ros6,
                ros7: elem.ros7,
                sum1: elem.sum1,
                sum2: elem.sum2,
                sum3: elem.sum3,
                sum4: elem.sum4,
                sum5: elem.sum5,
                sum6: elem.sum6,
                sum7: elem.sum7,
                upak: elem.upak,
                allItogIndex: elem.allItogIndex,
                allItog: elem.allItog,
                allItogUhod: elem.allItogUhod,
                allItogPrihod: elem.allItogPrihod,
                raznica: elem.raznica,
                itogs: elem.itogs,
            })),
        };

        const newotdelData = new NewOtdelDataModel(data);
        await newotdelData.save();
        console.log('Данные успешно сохранены');
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        res.sendStatus(500);
    }
};

const updateNewOtdelData = async (req, res) => {
    const { id } = req.params;
    const { buyer } = req.body;

    try {
        const updateDoc = await NewOtdelDataModel.findOneAndUpdate(
            { "otchet._id": id },
            { "otchet.$.buyer": buyer },
            { new: true }
        );

        if (!updateDoc) {
            return res.status(404).json({ error: 'Элемент не найден' });
        }

        console.log('Данные успешно обновлены');
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Произошла ошибка при обновлении данных' });
    }
};

const getNewOtdelData = async (req, res) => {
    try {
        const data = await NewOtdelDataModel.find();
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

export default { createNewOtdelData, updateNewOtdelData, getNewOtdelData };
