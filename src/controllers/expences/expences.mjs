import ExpensesModel from '../../models/expences/expences.mjs'

const setDataExpenses = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const currentMonthYear = `${month}.${year}`;
        const existingDocument = await ExpensesModel.findOne({ data: currentMonthYear });
        if (!existingDocument) {
            const daysInMonth = new Date(year, month, 0).getDate();
            const expensesForCurrentMonth = Array.from({ length: daysInMonth }, (_, index) => ({
                date: `${(index + 1).toString().padStart(2, '0')}.${month}.${year}`,
                amount: 0
            }));
            const newExpensesDocument = new ExpensesModel({
                data: currentMonthYear,
                week_result: 0,
                month_result: 0,
                departmentExpenses: [
                    {
                        names: "лидер",
                        expenses: expensesForCurrentMonth.map(expense => ({ ...expense, visible: false }))
                    },
                    {
                        names: "монако",
                        expenses: expensesForCurrentMonth.map(expense => ({ ...expense, visible: false }))
                    },
                    {
                        names: "туран",
                        expenses: expensesForCurrentMonth.map(expense => ({ ...expense, visible: false }))
                    },
                    {
                        names: "liberty",
                        expenses: expensesForCurrentMonth.map(expense => ({ ...expense, visible: false }))
                    },
                    {
                        names: "ильяс",
                        expenses: expensesForCurrentMonth.map(expense => ({ ...expense, visible: false }))
                    },
                    {
                        names: "ынтымак",
                        expenses: expensesForCurrentMonth.map(expense => ({ ...expense, visible: false }))
                    },
                ],
                fullfilments: [
                    {
                        names: "liberty фф",
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: "Улукбек фф",
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: "СП Адылбек",
                        expenses: expensesForCurrentMonth
                    }
                ],
                others: [
                    {
                        names: 'Курсы байера',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'Штрафы',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'Платные группы',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'Таргет',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'С продажи',
                        expenses: expensesForCurrentMonth
                    },
                ],
                teamleaders: [
                    {
                        names: 'Айбеков Арслан',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'Чабышов Адилет',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'Камилов Бекулан',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'Отдел Ильяс',
                        expenses: expensesForCurrentMonth
                    },
                    {
                        names: 'Кайрат байке',
                        expenses: expensesForCurrentMonth
                    },
                ]
            });
            await newExpensesDocument.save();
        }
        res.status(200).json({ message: 'Данные о расходах успешно установлены' });
    } catch (error) {
        console.log("Ошибка при сохранении документа:", error);
    }
}


const updateExpensePatch = async (req, res) => {
    try {
        const { id, selectedId, type } = req.params;
        const { amount } = req.body;

        let expense;
        if (type === 'fullfilments') {
            expense = await ExpensesModel.findOne({ "fullfilments.expenses": { $elemMatch: { _id: selectedId } } });
        } else if (type === 'others') {
            expense = await ExpensesModel.findOne({ "others.expenses": { $elemMatch: { _id: selectedId } } });
        } else if (type === 'teamleaders') {
            expense = await ExpensesModel.findOne({ "teamleaders.expenses": { $elemMatch: { _id: selectedId } } });
        }

        if (!expense) {
            return res.status(404).json({ error: 'Расход не найден' });
        }

        let monthResult = expense.month_result || 0;
        monthResult += parseInt(amount);

        expense.month_result = monthResult;

        if (type === 'fullfilments') {
            expense.fullfilments.forEach(fullfilment => {
                const foundExpense = fullfilment.expenses.find(exp => exp._id.toString() === selectedId);
                if (foundExpense) {
                    foundExpense.amount = amount;
                }
            });
        } else if (type === 'others') {
            expense.others.forEach(other => {
                const foundExpense = other.expenses.find(exp => exp._id.toString() === selectedId);
                if (foundExpense) {
                    foundExpense.amount = amount;
                }
            });
        } else if (type === 'teamleaders') {
            expense.teamleaders.forEach(teamleader => {
                const foundExpense = teamleader.expenses.find(exp => exp._id.toString() === selectedId);
                if (foundExpense) {
                    foundExpense.amount = amount;
                }
            });
        }

        await expense.save();

        res.status(200).json({ message: 'Данные о расходе успешно обновлены', expense });
    } catch (error) {
        console.log("Ошибка при обновлении данных о расходе:", error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};


const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await ExpensesModel.findOne({ "departmentExpenses.expenses": { $elemMatch: { _id: id } } });
        if (!expense) {
            return res.status(404).json({ error: 'Расход не найден' });
        }

        const foundExpense = expense.departmentExpenses.reduce((acc, department) => {
            const found = department.expenses.find(expense => expense._id == id);
            if (found) {
                return found;
            }
            return acc;
        }, null);
        if (!foundExpense) {
            return res.status(404).json({ error: 'расход не найден в массиве expenses' });
        }
        expense.month_result += foundExpense.amount
        foundExpense.visible = true;
        await expense.save();
        res.status(200).json({ message: 'Данные о расходе успешно обновлены', expense: foundExpense });
    } catch (error) {
        console.log("Ошибка при обновлении данных о расходе:", error);
        res.status(500).json({ error: 'Что-то пошло не так' });
    }
};

const updateNames = async (req, res) => {
    try {
        const { names, type } = req.body;
        const expense = await ExpensesModel.findOne();
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


const getExpensesData = async (req, res) => {
    try {
        const data = await ExpensesModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "Что то пошло не так",
        });
    }
}

export default { setDataExpenses, getExpensesData, updateExpense, updateExpensePatch, updateNames }