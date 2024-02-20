import { Telegraf, Markup } from 'telegraf';

const token = "YOUR_BOT_TOKEN";
const bot = new Telegraf(token);

const state = {};

bot.start((ctx) => {
    ctx.reply(
        "Привет! Внизу представлены команды для управления ботом:\n\n" +
        "/command1 - для создания нового счета-фактуры\n\n" +
        "/command2 - для изменения или удаления уже созданных счетов-фактур\n\n" +
        "/command3 - для просмотра статистики (количество заказов, коэффициент, комиссия и т.д.)\n\n" +
        "/command4 - для просмотра ежедневных отчетов."
    );
});

bot.command('command1', (ctx) => {
    state[ctx.from.id] = {}; // Инициализация состояния для данного пользователя
    askManager(ctx);
});

function askManager(ctx) {
    ctx.reply("Введите имя менеджера:");
}

function askAdmin(ctx) {
    ctx.reply("Введите имя админа:");
}

function askStatus(ctx) {
    ctx.reply("Введите статус:");
}

function askFIO(ctx) {
    ctx.reply("Введите ФИО клиента:");
}

function askCity(ctx) {
    ctx.reply("Введите город:");
}

function askBank(ctx) {
    ctx.reply("Введите банк:");
}

// Обработчики действий пользователя
bot.on('text', (ctx) => {
    const userId = ctx.from.id;
    const currentState = state[userId];

    if (currentState) {
        // Обработка ответа на вопрос
        if (!currentState.manager) {
            currentState.manager = ctx.message.text;
            askAdmin(ctx);
        } else if (!currentState.admin) {
            currentState.admin = ctx.message.text;
            askStatus(ctx);
        } else if (!currentState.status) {
            currentState.status = ctx.message.text;
            askFIO(ctx);
        } else if (!currentState.fio) {
            currentState.fio = ctx.message.text;
            askCity(ctx);
        } else if (!currentState.city) {
            currentState.city = ctx.message.text;
            askBank(ctx);
        } else if (!currentState.bank) {
            currentState.bank = ctx.message.text;
            // Вы можете выполнить здесь какую-то логику с полученными данными
            // Например, сохранить в базу данных и т.д.
            // После сохранения выведите результат
            const resultMessage = `Счет-фактура создан:\n\nМенеджер: ${currentState.manager}\nАдмин: ${currentState.admin}\nСтатус: ${currentState.status}\nФИО клиента: ${currentState.fio}\nГород: ${currentState.city}\nБанк: ${currentState.bank}`;

            const keyboard = Markup.inlineKeyboard([
                Markup.button.callback('Удалить счет-фактуру', 'delete_invoice'),
                Markup.button.callback('Заполнить позиции', 'fill_positions')
            ]);

            ctx.replyWithMarkdown(resultMessage, keyboard);
            delete state[userId]; // Очистка состояния для данного пользователя
        }
    }
});

bot.action('delete_invoice', (ctx) => {
    // Ваш код для удаления счета-фактуры
    ctx.reply('Счет-фактура удалена.');
});

bot.action('fill_positions', (ctx) => {
    // Ваш код для заполнения позиций
    ctx.reply('Заполняем позиции.');
});

export default bot