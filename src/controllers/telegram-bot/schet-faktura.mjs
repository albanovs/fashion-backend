import { Telegraf, Markup } from 'telegraf';

const token = "6928660684:AAH8rryO_0FdwaBHuGyKp6z90Rn2dPnrZKY";
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
    ctx.reply("Выберите статус:", Markup.inlineKeyboard([
        Markup.button.callback('Банк', 'select_status_bank'),
        Markup.button.callback('Карта', 'select_status_card')
    ]));
}

function askFIO(ctx) {
    ctx.reply("Введите ФИО клиента:");
}

function askCity(ctx) {
    ctx.reply("Введите город:");
}

function askBank(ctx) {
    ctx.reply("Выберите банк из списка:", Markup.inlineKeyboard([
        [Markup.button.callback('Байкай банк', 'select_bank_baikay'), Markup.button.callback('Оптима банк', 'select_bank_optima')],
        [Markup.button.callback('Дос-Кредо Банк', 'select_bank_doskredo'), Markup.button.callback('Компаньон Банк', 'select_bank_companion')],
        [Markup.button.callback('Capital Bank', 'select_bank_capital'), Markup.button.callback('Элсом', 'select_bank_elsom')],
        [Markup.button.callback('Финанс Кредит банк', 'select_bank_financecredit'), Markup.button.callback('Кыргызстан банк', 'select_bank_kyrgyzstan')]
    ]));
}

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

bot.action('select_bank_baikay', (ctx) => {
    state[ctx.from.id].bank = 'Байкай банк';
    finishSurvey(ctx)
});

bot.action('select_bank_optima', (ctx) => {
    state[ctx.from.id].bank = 'Оптима банк';
    finishSurvey(ctx)
});

bot.action('select_bank_companion', (ctx) => {
    state[ctx.from.id].bank = 'Компаньон банк';
    finishSurvey(ctx)
});

bot.action('select_bank_doskredo', (ctx) => {
    state[ctx.from.id].bank = 'Дос Кредо банк';
    finishSurvey(ctx)
});

bot.action('select_bank_capital', (ctx) => {
    state[ctx.from.id].bank = 'Capital Bank';
    finishSurvey(ctx)
});

bot.action('select_bank_financecredit', (ctx) => {
    state[ctx.from.id].bank = 'Финанс Кредит банк';
    finishSurvey(ctx)
});

bot.action('select_bank_elsom', (ctx) => {
    state[ctx.from.id].bank = 'Элсом';
    finishSurvey(ctx)
});

bot.action('select_bank_kyrgyzstan', (ctx) => {
    state[ctx.from.id].bank = 'Кыргызстан банк';
    finishSurvey(ctx)
});


function finishSurvey(ctx) {
    const userId = ctx.from.id;
    const currentState = state[userId];

    if (currentState) {
        // Удаляем предыдущие сообщения
        ctx.deleteMessage(ctx.message.message_id - 1);
        ctx.deleteMessage(ctx.message.message_id - 2);
        ctx.deleteMessage(ctx.message.message_id - 3);
        ctx.deleteMessage(ctx.message.message_id - 4);
        ctx.deleteMessage(ctx.message.message_id - 5);
        ctx.deleteMessage(ctx.message.message_id - 6);

        // Выводим результаты опроса
        const resultMessage = `Счет-фактура создан:\n\nМенеджер: ${currentState.manager}\nАдмин: ${currentState.admin}\nСтатус: ${currentState.status}\nФИО клиента: ${currentState.fio}\nГород: ${currentState.city}\nБанк: ${currentState.bank}`;
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('Удалить счет-фактуру', 'delete_invoice'),
            Markup.button.callback('Заполнить позиции', 'fill_positions')
        ]);
        ctx.reply(resultMessage, keyboard);
        delete state[userId]; // Очистка состояния для данного пользователя
    }
}



bot.action('select_status_bank', (ctx) => {
    state[ctx.from.id].status = 'Банк';
    askFIO(ctx); // Переходим к следующему этапу опроса
});

bot.action('select_status_card', (ctx) => {
    state[ctx.from.id].status = 'Карта';
    askFIO(ctx); // Переходим к следующему этапу опроса
});

export default bot