import cron from 'node-cron';
import ExpensesModel from '../../models/incoming-outgoing/incoming.mjs';

const createNewMonthDocument = async () => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const currentMonthYear = `${currentMonth.toString().padStart(2, '0')}.${currentYear}`;
        const existingDocument = await ExpensesModel.findOne({ data: currentMonthYear });

        if (!existingDocument) {
            const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            const previousMonthYear = `${previousMonth.toString().padStart(2, '0')}.${previousYear}`;
            const previousMonthData = await ExpensesModel.findOne({ data: previousMonthYear });
            if (previousMonthData) {
                const newDocumentData = {
                    data: currentMonthYear,
                    week_result: 0,
                    month_result: 0,
                    nomination: previousMonthData.nomination.map(item => ({
                        names: item.names,
                        expenses: Array.from({ length: item.expenses.length }, (_, index) => ({
                            date: `${(index + 1).toString().padStart(2, '0')}.${currentMonth.toString().padStart(2, '0')}.${currentYear}`,
                            amount: 0
                        }))
                    })),
                    employees: previousMonthData.employees.map(item => ({
                        names: item.names,
                        expenses: Array.from({ length: item.expenses.length }, (_, index) => ({
                            date: `${(index + 1).toString().padStart(2, '0')}.${currentMonth.toString().padStart(2, '0')}.${currentYear}`,
                            amount: 0
                        }))
                    }))
                };

                const newExpensesDocument = new ExpensesModel(newDocumentData);
                await newExpensesDocument.save();
            } else {
                const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
                const expensesForCurrentMonth = Array.from({ length: daysInMonth }, (_, index) => ({
                    date: `${(index + 1).toString().padStart(2, '0')}.${currentMonth.toString().padStart(2, '0')}.${currentYear}`,
                    amount: 0
                }));

                const newExpensesDocument = new ExpensesModel({
                    data: currentMonthYear,
                    week_result: 0,
                    month_result: 0,
                    nomination: [],
                    employees: [],
                });
                await newExpensesDocument.save();
            }

            console.log(`Документ для месяца ${currentMonthYear} успешно создан.`);
        } else {
            console.log(`Документ для месяца ${currentMonthYear} уже существует.`);
        }
    } catch (error) {
        console.error("Ошибка при создании документа расходов:", error);
    }
};

cron.schedule('0 0 1 * *', async () => {
    try {
        await createNewMonthDocument();
        console.log('Документ для нового месяца успешно создан.');
    } catch (error) {
        console.error('Ошибка при создании документа для нового месяца:', error);
    }
});

const addCategory = async (req, res) => {
    try {
        const { names, type } = req.body;
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentYear = currentDate.getFullYear();
        const currentMonthYear = `${currentMonth}.${currentYear}`;
        const expense = await ExpensesModel.findOne({ data: currentMonthYear });
        if (!expense) {
            return res.status(404).json({ error: 'Расходы не найдены' });
        }
        const result = await expense.addCategory(names, type);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.log("Ошибка при добавлении категории:", error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};

const updateExpensePatch = async (req, res) => {
    try {
        const { id, selectedId, type } = req.params;
        const { amount } = req.body;

        let expense;
        if (type === 'nomination') {
            expense = await ExpensesModel.findOne({ "nomination.expenses": { $elemMatch: { _id: selectedId } } });
        } else if (type === 'employees') {
            expense = await ExpensesModel.findOne({ "employees.expenses": { $elemMatch: { _id: selectedId } } });
        }
        if (!expense) {
            return res.status(404).json({ error: 'Расход не найден' });
        }

        if (type === 'nomination') {
            expense.nomination.forEach(nomination => {
                const foundExpense = nomination.expenses.find(exp => exp._id.toString() === selectedId);
                if (foundExpense) {
                    foundExpense.amount = amount;
                }
            });
        } else if (type === 'employees') {
            expense.employees.forEach(employee => {
                const foundExpense = employee.expenses.find(exp => exp._id.toString() === selectedId);
                if (foundExpense) {
                    foundExpense.amount = amount;
                }
            });
        }

        let monthResult = 0;
        expense.nomination.forEach(nomination => {
            nomination.expenses.forEach(exp => {
                monthResult += parseInt(exp.amount, 10);
            });
        });
        expense.employees.forEach(employee => {
            employee.expenses.forEach(exp => {
                monthResult += parseInt(exp.amount, 10);
            });
        });

        expense.month_result = monthResult;

        await expense.save();

        res.status(200).json({ message: 'Данные о расходе успешно обновлены', expense });
    } catch (error) {
        console.log("Ошибка при обновлении данных о расходе:", error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};

const updateNames = async (req, res) => {
    try {
        const { names, type } = req.body;
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentYear = currentDate.getFullYear();
        const currentMonthYear = `${currentMonth}.${currentYear}`;
        const expense = await ExpensesModel.findOne({ data: currentMonthYear });
        if (!expense) {
            return res.status(404).json({ error: 'Расходы не найдены' });
        }
        const result = await expense.updateNames(names, type);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.log("Ошибка при обновлении имен:", error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { categoryId, type } = req.body;
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentYear = currentDate.getFullYear();
        const currentMonthYear = `${currentMonth}.${currentYear}`;
        const expense = await ExpensesModel.findOne({ data: currentMonthYear });
        if (!expense) {
            return res.status(404).json({ error: 'Расходы не найдены' });
        }
        const result = await expense.deleteCategory(categoryId, type);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        console.log("Ошибка при удалении категории:", error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};

const getExpensesData = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const currentMonthYear = `${month}.${year}`;

        const data = await ExpensesModel.find({ data: currentMonthYear });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так при получении данных",
        });
    }
};

const getExpencesAllData = async (req, res) => {
    try {
        const data = await ExpensesModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что-то пошло не так при получении данных",
        });
    }
};

export default { getExpensesData, updateExpensePatch, updateNames, addCategory, deleteCategory, getExpencesAllData };