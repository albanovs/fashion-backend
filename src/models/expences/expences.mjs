import mongoose from "mongoose";

const DailyExpensesSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: Number,
    visible: Boolean
});

const DepartmentExpensesSchema = new mongoose.Schema({
    departmentName: String,
    expenses: [DailyExpensesSchema]
});

const MonthlyExpensesSchema = new mongoose.Schema({
    month: { type: String, required: true },
    year: { type: Number, required: true },
    departmentExpenses: [DepartmentExpensesSchema] 
});

const ExpensesModel = mongoose.model('expenses', MonthlyExpensesSchema);

export default ExpensesModel;
