import ExpensesModel from '../../models/expences/expences.mjs'

const newExpensesDocument = new ExpensesModel({
    month: "Январь 2024",
    year: 2024,
    departmentExpenses: [
        {
            departmentName: "lider",
            expenses: []
        },
        {
            departmentName: "monaco",
            expenses: []
        },
    ]
});

newExpensesDocument.save()
    .then((result) => {
        console.log("Документ успешно сохранен:", result);
    })
    .catch((error) => {
        console.error("Ошибка при сохранении документа:", error);
    });