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

const simModellogist = [
    SimModelLiderLog,
    SimModelFenixLog,
    SimModelLibertyLog,
    SimModelMonacoLog,
    SimModelNewOtdelLog,
    SimModelTuranLog
];

async function fetchAllDataFromSimModels() {
    try {
        const allData = {
            buyer: [],
            logist: [],
        };
        for (const SimModel of simModels) {
            const data = await SimModel.find({}).exec();
            allData.buyer.push({ model: SimModel, data });
        }
        for (const SimModel of simModellogist) {
            const data = await SimModel.find({}).exec();
            allData.logist.push({ model: SimModel, data });
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

async function checkPhoneNumberAndManagerInDatabase(phoneNumber, selectedTeam) {
    try {
        let logistModelIndex;
        switch (selectedTeam) {
            case 'leader':
                logistModelIndex = 0;
                break;
            case 'monaco':
                logistModelIndex = 3;
                break;
            case 'ilyas':
                logistModelIndex = 1;
                break;
            case 'turan':
                logistModelIndex = 5;
                break;
            case 'yntymak':
                logistModelIndex = 4;
                break;
            case 'liberty':
                logistModelIndex = 2;
                break;
            default:
                console.error('Выбран неверный отдел:', selectedTeam);
                return { isPhoneNumberRegistered: false, managerName: null, logistValues: [] };
        }
        const logistModel = allSimData.logist[logistModelIndex].data;
        for (const { model, data } of allSimData.buyer) {
            const result = data.find(doc => doc.slot.some(slot => slot.number === phoneNumber));
            if (result) {
                const slot = result.slot.find(elem => elem.number === phoneNumber);
                if (slot) {
                    let managerName = slot.buyer;
                    const logistData = await logistModel.find({}).exec();
                    const logistValues = logistData.reduce((values, entry) => {
                        if (entry.slot && Array.isArray(entry.slot)) {
                            for (const slotItem of entry.slot) {
                                if (slotItem.logist !== '') {
                                    values.push(slotItem.logist);
                                }
                            }
                        }
                        return values;
                    }, []);
                    return { isPhoneNumberRegistered: true, managerName, logistValues, team: selectedTeam };
                }
            }
        }
        return { isPhoneNumberRegistered: false, managerName: null, logistValues: [] };
    } catch (error) {
        console.error('Ошибка при поиске номера в кэшированных данных:', error);
        return { isPhoneNumberRegistered: false, managerName: null, logistValues: [] };
    }
}


bot.start((ctx) => {
    ctx.reply("Пожалуйста, отправьте свой номер телефона.", Markup.keyboard([
        Markup.button.contactRequest('Отправить номер телефона')
    ]).resize());
});

bot.on('contact', async (ctx) => {
    const userId = ctx.from.id;
    if (ctx.message.contact) {
        authorizedUsers.set(userId, { authorized: true, manager: "", logist: [], team: "" });
        const phoneNumber = ctx.message.contact.phone_number;
        if (!state[ctx.from.id]) {
            state[ctx.from.id] = {};
        }
        state[userId].number = phoneNumber;
        console.log(`Получен номер телефона: ${phoneNumber}`);
        sendCommandsMessage(ctx);
    } else {
        ctx.reply('Пожалуйста, отправьте контактное лицо с номером телефона.');
    }
});


function selectTeam(ctx) {
    ctx.reply("Выберите отдел из списка:", Markup.inlineKeyboard([
        [Markup.button.callback('Лидер', 'select_leader'), Markup.button.callback('Liberty', 'select_liberty')],
        [Markup.button.callback('Монако', 'select_monaco'), Markup.button.callback('Ынтымак', 'select_yntymak')],
        [Markup.button.callback('Ильяс', 'select_ilyas'), Markup.button.callback('Туран', 'select_turan')],
    ]))
}

bot.action('select_leader', (ctx) => {
    const userId = ctx.from.id;
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    const phoneNumber = state[userId].number;
    state[userId].team = 'leader';
    handleContactAndTeam(ctx, phoneNumber);
});

bot.action('select_monaco', (ctx) => {
    const userId = ctx.from.id;
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    const phoneNumber = state[userId].number;
    state[userId].team = 'monaco';
    handleContactAndTeam(ctx, phoneNumber);
});

bot.action('select_ilyas', (ctx) => {
    const userId = ctx.from.id;
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    const phoneNumber = state[userId].number;
    state[userId].team = 'ilyas';
    handleContactAndTeam(ctx, phoneNumber);
});

bot.action('select_liberty', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    const userId = ctx.from.id;
    const phoneNumber = state[userId].number;
    state[userId].team = 'liberty';
    handleContactAndTeam(ctx, phoneNumber);
});

bot.action('select_turan', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    const userId = ctx.from.id;
    state[userId].team = 'turan';
    const phoneNumber = state[userId].number;
    handleContactAndTeam(ctx, phoneNumber);
});

bot.action('select_yntymak', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    const userId = ctx.from.id;
    state[userId].team = 'yntymak';
    const phoneNumber = state[userId].number;
    handleContactAndTeam(ctx, phoneNumber);
});

async function handleContactAndTeam(ctx, phone_number) {
    const userId = ctx.from.id;
    const phoneNumber = phone_number;
    const selectedTeam = state[userId].team;
    const { isPhoneNumberRegistered, managerName, logistValues, team } = await checkPhoneNumberAndManagerInDatabase(phoneNumber, selectedTeam);
    if (isPhoneNumberRegistered) {
        state[userId].team = selectedTeam
        authorizedUsers.set(userId, { authorized: true, manager: managerName, logist: logistValues, team });
        if (managerName) {
            console.log(`Имя менеджера: ${managerName}`)
            askAdmin(ctx);
        }
    } else {
        ctx.reply('Извините, у вас нет доступа к боту.');
    }
}

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
    selectTeam(ctx)
});

bot.command('command2', async (ctx) => {
    state[ctx.from.id] = {};
    const userId = ctx.from.id;

    const userStatus = authorizedUsers.get(userId);
    if (userStatus && userStatus.authorized) {
        const results = await schetfakturaModel.find({ user_id: userId });
        const inlineKeyboard = [];
        let row = [];
        results.forEach(client => {
            const button = Markup.button.callback(client.FIO, `select_client_${client.FIO}`);
            row.push(button);
            if (row.length === 2) {
                inlineKeyboard.push(row);
                row = [];
            }
        })

        if (row.length > 0) {
            inlineKeyboard.push(row);
        }

        const replyMarkup = Markup.inlineKeyboard(inlineKeyboard);
        ctx.reply("Выберите клиента:", replyMarkup);
    } else {
        ctx.reply('Пожалуйста, авторизуйтесь, отправив свой номер телефона.');
    }
});

function askAdmin(ctx) {
    const inlineKeyboard = [];
    let row = [];
    const userStatus = authorizedUsers.get(ctx.from.id);
    if (userStatus && userStatus.authorized) {
        const { logist } = userStatus;
        logist.forEach(admin => {
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
    } else {
        ctx.reply('Пожалуйста, авторизуйтесь, отправив свой номер телефона.');
    }
    if (row.length > 0) {
        inlineKeyboard.push(row);
    }
    const replyMarkup = Markup.inlineKeyboard(inlineKeyboard);
    ctx.reply("Выберите админа:", replyMarkup);
}

bot.action(/select_client_/, (ctx) => {
    const clientName = ctx.match.input.split('_')[2];
    const userId = ctx.from.id;
    const currentState = state[userId];
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    if (currentState) {
        state[ctx.from.id].change = clientName;
        set_position(ctx);
    } else {
        ctx.reply('Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.');
    }
})


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
    const userId = ctx.from.id;
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[userId].context = 'initial';
    ctx.reply("Введите имя и город клиента в формате: 'имя-город', например: Анна-москва");
}

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const currentState = state[userId];
    const messageText = ctx.message.text;
    const parts = messageText.split('-');

    if (currentState) {
        switch (currentState.context) {
            case 'initial':
                if (parts.length === 2) {
                    const name = parts[0];
                    const city = parts[1];
                    currentState.fio = name;
                    currentState.city = city;
                    askBank(ctx);
                } else {
                    ctx.reply('Неверный формат текста. Пожалуйста, введите данные в формате "имя-город".');
                }
                break;
            case 'perevod':
                if (parts.length === 3) {
                    const perevod = parseFloat(parts[0]);
                    const valuta = parts[1];
                    const curs = parseFloat(parts[2]);
                    const summa = (parseFloat(perevod) * parseFloat(curs)).toFixed(0)
                    if (!isNaN(perevod) && !isNaN(curs) && !isNaN(summa)) {
                        const newPosition = { perevod, valuta, curs, summa };
                        try {
                            await updateInvoiceTransfer(currentState.change, userId, newPosition);
                            ctx.reply(`Перевод : ${perevod} , Валюта: ${valuta}, Курс: ${curs} успешно добавлена.`);
                            await updateSchetData.updateSchetSumma()
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
                break;
            case 'position':
                if (parts.length === 3) {
                    const name = parts[0];
                    const count = parseInt(parts[1], 10);
                    const price = parseInt(parts[2], 10);
                    const summa = parseFloat(count) * parseFloat(price)

                    if (!isNaN(count) && !isNaN(price)) {
                        const newPosition = { name, count, price, summa };

                        try {
                            await updateInvoicePosition(currentState.change, userId, newPosition);
                            ctx.reply(`Позиция "${name}" (${count} шт, ${price} сом) успешно добавлена.`);
                            await updateSchetData.updateSchetData()
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
                break;
            default:
                ctx.reply(`контекст не определен`);
                break;
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
    const userStatus = authorizedUsers.get(userId);
    if (currentState && userStatus) {
        try {
            currentState.change = currentState.fio
            await saveDataToDatabase(currentState, userId, userStatus.team);
            await ctx.reply("Счет фактура создан и сохранен на сайт, введите сумму перевода:", Markup.inlineKeyboard([
                Markup.button.callback('Ввести', 'set_perevod'),
            ]));
        } catch (error) {
            console.error('Ошибка при сохранении данных в базу данных:', error);
            ctx.reply('Произошла ошибка при создании счета-фактуры. Пожалуйста, попробуйте еще раз.');
        }
    }
});

bot.action('set_perevod', (ctx) => {
    const userId = ctx.from.id;
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[userId].context = 'perevod';
    ctx.reply("Введите сумму перевода, валюту и курс в формате: 'сумма-валюта-курс', например: 5000-доллар-89");
})

async function set_position(ctx) {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[ctx.from.id].context = 'position';
    const data = await schetfakturaModel.find({ FIO: state[ctx.from.id].change, user_id: ctx.from.id })
    let balans
    data.map(i => balans = i.balans)
    ctx.reply(`Заполните позицию в формате 'наименование-количество-цена', например: блузка-40-420 \n баланс: ${balans} `,
        Markup.inlineKeyboard([
            Markup.button.callback('завершить счет фактуру', 'success_position'),
            Markup.button.callback('Добавить перевод', 'set_perevod'),
        ]));
}

bot.action('set_position', (ctx) => {
    if (!state[ctx.from.id]) {
        state[ctx.from.id] = {};
    }
    state[userId].context = 'position';
    ctx.reply("Заполните позицию в формате 'наименование-количество-цена', например: блузка-40-420",
        Markup.inlineKeyboard([
            Markup.button.callback('завершить счет фактуру', 'success_position'),
            Markup.button.callback('Добавить перевод', 'set_perevod'),
        ]));
});

bot.action('success_position', async (ctx) => {
    ctx.reply('Счет фактура успешно завершена');
    await updateSchetData.updateSchetTeam()
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
            Отдел: ${userStatus.team}\n
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

async function saveDataToDatabase(data, userId, team) {
    try {
        const today = new Date();
        const formattedDate = formatDate(today);
        const newSchetFaktura = new schetfakturaModel({
            user_id: userId,
            team: team,
            datas: formattedDate,
            manager: data.manager,
            admin: data.admin,
            status: data.status,
            FIO: data.fio,
            city: data.city,
            bank: data.bank,
            transfer: [],
            ostatok: 0,
            budjet: 0,
            position: [],
            balans: 0,
            all_sum: 0,
            upakovka: 0,
            dostavka: 0,
            comission: 0,
            itogs: 0
        });
        await newSchetFaktura.save();
    } catch (error) {
        console.error('Ошибка при сохранении данных в базу данных:', error);
        throw error;
    }
}

async function updateInvoiceTransfer(change, userId, newPosition) {
    try {
        const invoice = await schetfakturaModel.findOne({ FIO: change, user_id: userId });
        if (invoice) {
            invoice.transfer.push(newPosition);
            await invoice.save();
        } else {
            console.error('Счет-фактура для пользователя с указанной датой не найдена.');
            throw new Error('Счет-фактура для пользователя с указанной датой не найдена.');
        }
    } catch (error) {
        console.error('Ошибка при добавлении позиции к существующим данным в базе данных:', error);
        throw error;
    }
}

async function updateInvoicePosition(change, userId, newPosition) {
    try {
        const invoice = await schetfakturaModel.findOne({ FIO: change, user_id: userId });
        if (invoice) {
            invoice.position.push(newPosition);
            await invoice.save();
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