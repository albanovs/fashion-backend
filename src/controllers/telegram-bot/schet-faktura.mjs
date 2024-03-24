import { Telegraf, Markup } from 'telegraf';
import cron from 'node-cron'
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
import schetfakturaModel from '../../models/schet-factura/schet-faktura.mjs';
import updateSchetData from '../telegram-bot/schet-control.mjs'

const token = "6928660684:AAH8rryO_0FdwaBHuGyKp6z90Rn2dPnrZKY";
const bot = new Telegraf(token);

const state = {};
const authorizedUsers = new Map();
let allSimData = []

const simModels = [
    SimModelLider,
    SimModelFenix,
    SimModelLiberty,
    SimModelMonaco,
    SimModelNewOtdel,
    SimModelTuran
];

async function fetchAllDataFromSimModels() {
    try {
        const allData = [];
        for (const SimModel of simModels) {
            const data = await SimModel.find({}).exec();
            allData.push({ model: SimModel, data });
        }
        return allData;
    } catch (error) {
        console.error('Ошибка при получении данных из моделей SIM-карт:', error);
        return [];
    }
}
async function updateSimDataDaily() {
    allSimData = await fetchAllDataFromSimModels();
}
cron.schedule('0 0 * * *', async () => {
    await updateSimDataDaily();
});

updateSimDataDaily()

// async function checkPhoneNumberAndManagerInDatabase(phoneNumber) {
//     try {
//         for (const SimModel of simModels) {
//             const result = await SimModel.findOne({ "slot.number": phoneNumber }).exec();
//             if (result) {
//                 const slot = result.slot.find(elem => elem.number === phoneNumber);
//                 if (slot) {
//                     let managerName = slot.buyer;
//                     if (SimModel === SimModelLider) {
//                         const logistData = await SimModelLiderLog.find({}).exec();
//                         if (logistData && logistData.length > 0) {
//                             const logistValues = [];

//                             for (const entry of logistData) {
//                                 if (entry.slot && Array.isArray(entry.slot)) {
//                                     for (const slotItem of entry.slot) {
//                                         if (slotItem.logist !== '') {
//                                             logistValues.push(slotItem.logist);
//                                         }
//                                     }
//                                 }
//                             }
//                             return { isPhoneNumberRegistered: true, managerName, logistValues };
//                         }
//                     }
//                 }
//             }
//         }
//         return { isPhoneNumberRegistered: false, managerName: null };
//     } catch (error) {
//         console.error('Ошибка при поиске номера в базе данных:', error);
//         return { isPhoneNumberRegistered: false, managerName: null };
//     }
// }

async function checkPhoneNumberAndManagerInDatabase(phoneNumber) {
    try {
        for (const { model, data } of allSimData) {
            const result = data.find(item => item.slot.some(slot => slot.number === phoneNumber));
            if (result) {
                const slot = result.slot.find(elem => elem.number === phoneNumber);
                if (slot) {
                    let managerName = slot.buyer;
                    if (model === SimModelLider) {
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
        console.error('Ошибка при проверке номера телефона и менеджера в базе данных:', error);
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
    const inlineKeyboard = [];
    let row = [];

    logistValues.forEach(admin => {
        const hasInvalidCharacters = /[()]/.test(admin);
        if (hasInvalidCharacters) {
            return;
        }
        const button = Markup.button.callback(admin, `select_admin_${admin}`);
        row.push(button);
        if (row.length === 2) {
            inlineKeyboard.push(row);
            row = [];
        }
    });

    if (row.length > 0) {
        inlineKeyboard.push(row);
    }

    const replyMarkup = Markup.inlineKeyboard(inlineKeyboard);
    ctx.reply("Выберите админа:", replyMarkup);
}



bot.action(/select_admin_/, (ctx) => {
    const adminName = ctx.match.input.split('_')[2];
    const userId = ctx.from.id;
    const currentState = state[userId];
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    if (currentState) {
        state[ctx.from.id].admin = adminName;
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
    ctx.reply("Введите имя и город клиента в формате: 'имя-город', например: Анна-москва");
}

function askperevod(ctx) {
    ctx.reply("Введите сумму перевода, валюту и курс в формате: 'сумма-валюта-курс', например: 5000-доллар-89");
}

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const currentState = state[userId];

    if (currentState) {
        if (!currentState.fio && !currentState.city) {
            const messageText = ctx.message.text;
            const parts = messageText.split('-');

            if (parts.length === 2) {
                const name = parts[0];
                const city = parts[1];
                currentState.fio = name
                currentState.city = city

            } else {
                ctx.reply('Неверный формат текста. Пожалуйста, введите данные в формате "имя-город".');
            }
            askBank(ctx);
        } else if (!currentState.perevod && !currentState.valuta && !currentState.curs) {
            const massageText = ctx.message.text
            const parts = massageText.split('-')
            if (parts.length === 3) {
                const perevod = parts[0];
                const valuta = parts[1];
                const curs = parts[2];
                if (!isNaN(perevod) && !isNaN(curs)) {
                    const newPosition = { perevod, valuta, curs };
                    try {
                        await updateInvoiceTransfer(userId, newPosition);
                        ctx.reply(`Перевод : ${perevod} , Валюта: ${valuta}, Курс: ${curs} успешно добавлена.`);
                        set_position(ctx);
                    } catch (error) {
                        console.error('Ошибка при обновлении данных в базе данных:', error);
                        ctx.reply('Произошла ошибка при добавлении позиции. Пожалуйста, попробуйте еще раз.');
                    }
                } else {
                    ctx.reply('Неверный формат количества или цены. Пожалуйста, введите числовые значения.');
                }
            } else {
                ctx.reply('Неверный формат текста. Пожалуйста, введите данные в формате "сумма-валюта-курс".');
            }
            askBank(ctx);
        } else {
            const messageText = ctx.message.text;
            const parts = messageText.split('-');

            if (parts.length === 3) {
                const name = parts[0];
                const count = parseInt(parts[1], 10);
                const price = parseInt(parts[2], 10);
                const summa = parseFloat(count) * parseFloat(price)

                if (!isNaN(count) && !isNaN(price)) {
                    const newPosition = { name, count, price, summa };

                    try {
                        await updateInvoicePosition(userId, newPosition);
                        ctx.reply(`Позиция "${name}" (${count} шт, ${price} сом) успешно добавлена.`);
                        set_position(ctx);
                    } catch (error) {
                        console.error('Ошибка при обновлении данных в базе данных:', error);
                        ctx.reply('Произошла ошибка при добавлении позиции. Пожалуйста, попробуйте еще раз.');
                    }
                } else {
                    ctx.reply('Неверный формат количества или цены. Пожалуйста, введите числовые значения.');
                }
            } else {
                ctx.reply('Неверный формат текста. Пожалуйста, введите данные в формате "наименование-количество-цена".');
            }
        }
    } else {
        const messageText = ctx.message.text;
        const parts = messageText.split('-');

        if (parts.length === 3) {
            const name = parts[0];
            const count = parseInt(parts[1], 10);
            const price = parseInt(parts[2], 10);
            const summa = parseFloat(count) * parseFloat(price)

            if (!isNaN(count) && !isNaN(price)) {
                const newPosition = { name, count, price, summa };

                try {
                    await updateInvoicePosition(userId, newPosition);
                    ctx.reply(`Позиция "${name}" (${count} шт, ${price} сом) успешно добавлена.`);
                    set_position(ctx);
                } catch (error) {
                    console.error('Ошибка при обновлении данных в базе данных:', error);
                    ctx.reply('Произошла ошибка при добавлении позиции. Пожалуйста, попробуйте еще раз.');
                }
            } else {
                ctx.reply('Неверный формат количества или цены. Пожалуйста, введите числовые значения.');
            }
        } else {
            ctx.reply('Неверный формат текста. Пожалуйста, введите данные в формате "наименование-количество-цена".');
        }
    }
});

function askBank(ctx) {
    ctx.reply("Выберите банк из списка:", Markup.inlineKeyboard([
        [Markup.button.callback('Байкай банк', 'select_bank_baikay'), Markup.button.callback('Оптима банк', 'select_bank_optima')],
        [Markup.button.callback('Дос-Кредо Банк', 'select_bank_doskredo'), Markup.button.callback('Компаньон Банк', 'select_bank_companion')],
        [Markup.button.callback('Capital Bank', 'select_bank_capital'), Markup.button.callback('Элсом', 'select_bank_elsom')],
        [Markup.button.callback('Финанс Кредит банк', 'select_bank_financecredit'), Markup.button.callback('Кыргызстан банк', 'select_bank_kyrgyzstan')]
    ]));
}

bot.action('create_invoice', async (ctx) => {
    const userId = ctx.from.id;
    const currentState = state[userId];
    if (currentState) {
        try {
            await saveDataToDatabase(currentState, userId);
            await ctx.reply("Счет фактура создан и сохранен на сайт, введите сумму перевода:", Markup.inlineKeyboard([
                Markup.button.callback('Ввести', 'set_perevod'),
            ]));
        } catch (error) {
            console.error('Ошибка при сохранении данных в базу данных:', error);
            ctx.reply('Произошла ошибка при создании счета-фактуры. Пожалуйста, попробуйте еще раз.');
        }
    }
});

bot.action('set_pervevod', (ctx) => {
    askperevod(ctx)
})

function set_position(ctx) {
    ctx.reply("Заполните позицию в формате 'наименование-количество-цена', например: блузка-40-420",
        Markup.inlineKeyboard([
            Markup.button.callback('завершить счет фактуру', 'success_position'),
        ]));
}

bot.action('set_position', (ctx) => {
    ctx.reply("Заполните позицию в формате 'наименование-количество-цена', например: блузка-40-420",
        Markup.inlineKeyboard([
            Markup.button.callback('завершить счет фактуру', 'success_position'),
        ]));
});

bot.action('success_position', async (ctx) => {
    ctx.reply('Счет фактура успешно завершена');
    await updateSchetData.updateSchetData()
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
            const resultMessage = `Проверьте данные счет-фактуры:\n\n
            Менеджер: ${currentState.manager}\n
            Админ: ${currentState.admin}\n
            Статус: ${currentState.status}\n
            ФИО клиента: ${currentState.fio}\n
            Город: ${currentState.city}\n
            Банк: ${currentState.bank}\n
            `;
            const keyboard = Markup.inlineKeyboard([
                Markup.button.callback('Создать счет-фактуру', 'create_invoice'),
                Markup.button.callback('Заново заполнить', 'reload')
            ]);
            ctx.reply(resultMessage, keyboard).then((message) => {
                currentState.resultMessageId = message.message_id;
            }).catch((error) => {
                console.error('Ошибка при отправке сообщения с результатами опроса:', error);
            });
        } else {
            ctx.reply('Извините, у вас нет доступа к боту.');
        }
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

async function saveDataToDatabase(data, userId) {
    try {
        const today = new Date();
        const formattedDate = formatDate(today);
        const newSchetFaktura = new schetfakturaModel({
            user_id: userId,
            datas: formattedDate,
            manager: data.manager,
            admin: data.admin,
            status: data.status,
            FIO: data.fio,
            city: data.city,
            bank: data.bank,
            transfer: [],
            ostatok: 0,
            budjet: parseFloat(data.perevod) * parseFloat(data.curs),
            position: [],
            balans: 0,
            all_sum: 0,
            upakovka: 0,
            dostavka: 0,
            comission: 0,
            itogs: 0
        });
        const savedData = await newSchetFaktura.save();
    } catch (error) {
        console.error('Ошибка при сохранении данных в базу данных:', error);
        throw error;
    }
}

async function updateInvoiceTransfer(userId, newPosition) {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();

    const formattedDate = `${day}.${month}.${year}`;
    try {
        const invoice = await schetfakturaModel.findOne({ user_id: userId, datas: formattedDate });
        if (invoice) {
            invoice.transfer.push(newPosition);
            await invoice.save();
            console.log('Сумма успешно добавлена к существующим данным в базе данных.');
        } else {
            console.error('Счет-фактура для пользователя с указанной датой не найдена.');
            throw new Error('Счет-фактура для пользователя с указанной датой не найдена.');
        }
    } catch (error) {
        console.error('Ошибка при добавлении позиции к существующим данным в базе данных:', error);
        throw error;
    }
}

async function updateInvoicePosition(userId, newPosition) {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();

    const formattedDate = `${day}.${month}.${year}`;
    try {
        const invoice = await schetfakturaModel.findOne({ user_id: userId, datas: formattedDate });
        if (invoice) {
            invoice.position.push(newPosition);
            await invoice.save();
            console.log('Позиция успешно добавлена к существующим данным в базе данных.');
        } else {
            console.error('Счет-фактура для пользователя с указанной датой не найдена.');
            throw new Error('Счет-фактура для пользователя с указанной датой не найдена.');
        }
    } catch (error) {
        console.error('Ошибка при добавлении позиции к существующим данным в базе данных:', error);
        throw error;
    }
}


export default bot