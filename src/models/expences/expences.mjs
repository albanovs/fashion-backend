    import mongoose from "mongoose";

    const MonthlyExpensesSchema = new mongoose.Schema({
        data: String,
        week_result: Number,
        month_result: Number,
        departmentExpenses: [
            {
                names: String,
                expenses: [
                    {
                        date: String,
                        amount: Number,
                        visible: Boolean
                    }
                ]
            }
        ],
        fullfilments: [
            {
                names: String,
                expenses: [
                    {
                        date: String,
                        amount: Number,
                    }
                ]
            }
        ],
        others: [
            {
                names: String,
                expenses: [
                    {
                        date: String,
                        amount: Number
                    }
                ]
            }
        ],
        teamleaders: [
            {
                names: String,
                expenses: [
                    {
                        date: String,
                        amount: Number
                    }
                ]
            }
        ]
    });

    MonthlyExpensesSchema.methods.updateNames = async function (names, type) {
        try {
            if (type === 'others' || type === 'teamleaders' ||
                type === 'fullfilments' || type === 'departmentExpenses') {
                this[type][0].names = names;
                await this.save();
                return { message: 'Имена успешно обновлены' };
            } else {
                return { error: 'Неверный тип категории расходов' };
            }
        } catch (error) {
            console.log("Ошибка при обновлении имен:", error);
            return { error: 'Что-то пошло не так' };
        }
    };

    const ExpensesModel = mongoose.model('expenses', MonthlyExpensesSchema);

    export default ExpensesModel;
