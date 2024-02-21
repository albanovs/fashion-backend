import { Telegraf, Markup } from 'telegraf';
import SimModelLider from '../../models/simcard/simlider.mjs';
import SimModelFenix from '../../models/simcard/simfenix.mjs';
import SimModelLiberty from '../../models/simcard/simliberty.mjs';
import SimModelMonaco from '../../models/simcard/simmonaco.mjs';
import SimModelNewOtdel from '../../models/simcard/simnewotdel.mjs';
import SimModelTuran from '../../models/simcard/simturan.mjs';

import SimModelLiderLog from '../../models/simcardlogist/liderlogist.mjs';
import SimModelFenixLog from '../../models/simcardlogist/fenixlogist.mjs';
import SimModelLibertyLog from '../../models/simcardlogist/libertylogist.mjs';
import SimModelMonacoLog from '../../models/simcardlogist/monacologist.mjs';
import SimModelNewOtdelLog from '../../models/simcardlogist/newotdellogist.mjs';
import SimModelTuranLog from '../../models/simcardlogist/turanlogist.mjs';

const token = "6928660684:AAH8rryO_0FdwaBHuGyKp6z90Rn2dPnrZKY";
const bot = new Telegraf(token);

const state = {};
const authorizedUsers = new Map();
const simModels = [
    SimModelLider,
    SimModelFenix,
    SimModelLiberty,
    SimModelMonaco,
    SimModelNewOtdel,
    SimModelTuran
];

async function checkPhoneNumberAndManagerInDatabase(phoneNumber) {
    try {
        for (const SimModel of simModels) {
            const result = await SimModel.findOne({ "slot.number": phoneNumber }).exec();
            if (result) {
                const slot = result.slot.find(elem => elem.number === phoneNumber);
                if (slot) {
                    let managerName = slot.buyer;
                    if (SimModel === SimModelLider) {
                        const logistData = await SimModelLiderLog.find({}).exec();
                        if (logistData && logistData.length > 0) {
                            const logistValues = [];

                            for (const entry of logistData) {
                                if (entry.slot && Array.isArray(entry.slot)) {
                                    for (const slotItem of entry.slot) {
                                        if (slotItem.logist !== '') {
                                            logistValues.push(slotItem.logist);
                                        }
                                    }
                                }
                            }
                            return { isPhoneNumberRegistered: true, managerName, logistValues };
                        }
                    }
                }
            }
        }
        return { isPhoneNumberRegistered: false, managerName: null };
    } catch (error) {
        console.error('Ошибка при поиске номера в базе данных:', error);
        return { isPhoneNumberRegistered: false, managerName: null };
    }
}

bot.start((ctx) => {
    ctx.reply("Пожалуйста, отправьте свой номер телефона.", Markup.keyboard([
        Markup.button.contactRequest('Отправить номер телефона')
    ]).resize());
});

bot.on('contact', async (ctx) => {
    const userId = ctx.from.id;
    const phoneNumber = ctx.message.contact.phone_number;
    console.log(`Получен номер телефона: ${phoneNumber}`);
    const { isPhoneNumberRegistered, managerName, logistValues } = await checkPhoneNumberAndManagerInDatabase(phoneNumber);
    if (isPhoneNumberRegistered) {
        authorizedUsers.set(userId, { authorized: true, manager: managerName, logist: logistValues });
        if (managerName) {
            console.log(`Имя менеджера: ${managerName}`)
            sendCommandsMessage(ctx); // Отправляем сообщения о командах
        }
    } else {
        ctx.reply('Извините, у вас нет доступа к боту.');
    }
});

function sendCommandsMessage(ctx) {
    ctx.reply(
        "Привет! Внизу представлены команды для управления ботом:\n\n" +
        "/command1 - для создания нового счета-фактуры\n\n" +
        "/command2 - для изменения или удаления уже созданных счетов-фактур\n\n" +
        "/command3 - для просмотра статистики (количество заказов, коэффициент, комиссия и т.д.)\n\n" +
        "/command4 - для просмотра ежедневных отчетов."
    );
}

bot.command('command1', (ctx) => {
    state[ctx.from.id] = {};
    const userId = ctx.from.id;

    const userStatus = authorizedUsers.get(userId);
    if (userStatus && userStatus.authorized) {
        const { logist } = userStatus;
        askAdmin(ctx, logist);
    } else {
        ctx.reply('Пожалуйста, авторизуйтесь, отправив свой номер телефона.');
    }
});

function askAdmin(ctx, logistValues) {
    const inlineKeyboard = logistValues.map(admin => [Markup.button.callback(admin, `select_admin_${admin}`)]);
    const replyMarkup = Markup.inlineKeyboard(inlineKeyboard);
    ctx.reply("Выберите админа:", replyMarkup);
}

bot.action(/select_admin_/, (ctx) => {
    const adminName = ctx.match.input.split('_')[2];
    const userId = ctx.from.id;
    const currentState = state[userId];
    if (currentState) {
        currentState.admin = adminName;
        askStatus(ctx);
    } else {
        ctx.reply('Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.');
    }
});


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
        if (!currentState.status) {
            currentState.status = ctx.message.text;
            askFIO(ctx);
        } else if (!currentState.fio) {
            currentState.fio = ctx.message.text;
            askCity(ctx);
        } else if (!currentState.city) {
            currentState.city = ctx.message.text;
            askBank(ctx);
        } else if (!currentState.bank) {
            finishSurvey(ctx);
        }
    }
});

bot.action('delete_invoice', (ctx) => {
    ctx.reply('Счет-фактура удалена.');
});

bot.action('fill_positions', (ctx) => {
    ctx.reply('Заполняем позиции.');
});

bot.action('select_bank_baikay', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Байкай банк';
    finishSurvey(ctx);
});

bot.action('select_bank_optima', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Оптима банк';
    finishSurvey(ctx);
});

bot.action('select_bank_companion', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Компаньон банк';
    finishSurvey(ctx);
});

bot.action('select_bank_doskredo', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Дос Кредо банк';
    finishSurvey(ctx);
});

bot.action('select_bank_capital', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Capital Bank';
    finishSurvey(ctx);
});

bot.action('select_bank_financecredit', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Финанс Кредит банк';
    finishSurvey(ctx);
});

bot.action('select_bank_elsom', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Элсом';
    finishSurvey(ctx);
});

bot.action('select_bank_kyrgyzstan', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].bank = 'Кыргызстан банк';
    finishSurvey(ctx);
});

bot.action('select_status_bank', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].status = 'Банк';
    askFIO(ctx);
});

bot.action('select_status_card', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].status = 'Карта';
    askFIO(ctx);
});


function finishSurvey(ctx) {
    const userId = ctx.from.id;
    const currentState = state[userId];

    if (currentState) {
        const userStatus = authorizedUsers.get(userId);
        if (userStatus && userStatus.authorized) {
            currentState.manager = userStatus.manager;
            const resultMessage = `Счет-фактура создан:\n\nМенеджер: ${currentState.manager}\nАдмин: ${currentState.admin}\nСтатус: ${currentState.status}\nФИО клиента: ${currentState.fio}\nГород: ${currentState.city}\nБанк: ${currentState.bank}`;
            const keyboard = Markup.inlineKeyboard([
                Markup.button.callback('Удалить счет-фактуру', 'delete_invoice'),
                Markup.button.callback('Заполнить позиции', 'fill_positions')
            ]);
            ctx.reply(resultMessage, keyboard).then((message) => {
                currentState.resultMessageId = message.message_id;
            }).catch((error) => {
                console.error('Ошибка при отправке сообщения с результатами опроса:', error);
            });

            delete state[userId];
        } else {
            ctx.reply('Извините, у вас нет доступа к боту.');
        }
    }
}


export default bot