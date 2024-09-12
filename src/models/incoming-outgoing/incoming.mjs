import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    date: String,
    amount: Number,
});

const CategorySchema = new mongoose.Schema({
    names: String,
    expenses: [ExpenseSchema]
});

const MonthlyExpensesSchema = new mongoose.Schema({
    data: String,
    week_result: Number,
    month_result: Number,
    nomination: [CategorySchema],
    employees: [CategorySchema],
});

MonthlyExpensesSchema.methods.updateNames = async function (names, type) {
    try {
        if (type === 'nomination' || type === 'employees') {
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

MonthlyExpensesSchema.methods.deleteCategory = async function (categoryId, type) {
    try {
        if (type === 'nomination') {
            this.nomination = this.nomination.filter(category => category._id.toString() !== categoryId);
        } else if (type === 'employees') {
            this.employees = this.employees.filter(category => category._id.toString() !== categoryId);
        } else {
            return { error: 'Неверный тип категории расходов' };
        }

        await this.save();
        return { message: 'Категория успешно удалена' };
    } catch (error) {
        console.log("Ошибка при удалении категории:", error);
        return { error: 'Что-то пошло не так' };
    }
};


MonthlyExpensesSchema.methods.addCategory = async function (names, type) {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const expensesForCurrentMonth = Array.from({ length: daysInMonth }, (_, index) => ({
            date: `${(index + 1).toString().padStart(2, '0')}.${(currentMonth + 1).toString().padStart(2, '0')}.${currentYear}`,
            amount: 0
        }));

        const newCategory = {
            names: names,
            expenses: expensesForCurrentMonth
        };

        if (type === 'nomination') {
            this.nomination.push(newCategory);
        } else if (type === 'employees') {
            this.employees.push(newCategory);
        } else {
            return { error: 'Неверный тип категории расходов' };
        }

        await this.save();
        return { message: 'Новая категория успешно добавлена' };
    } catch (error) {
        console.log("Ошибка при добавлении категории:", error);
        return { error: 'Что-то пошло не так' };
    }
};


const ExpensesModel = mongoose.model('expenses', MonthlyExpensesSchema);

export default ExpensesModel;