import { Telegraf } from 'telegraf'

const token = "6928660684:AAH8rryO_0FdwaBHuGyKp6z90Rn2dPnrZKY"
const bot = new Telegraf("6928660684:AAH8rryO_0FdwaBHuGyKp6z90Rn2dPnrZKY")

bot.start((ctx) => {
    ctx.reply("Привет! Чем могу помочь?");
    // Отправка клавиатуры с выбором действий
    ctx.reply("Выберите действие:", {
        reply_markup: {
            keyboard: [
                [{ text: "Создать счет-фактуру" }],
                [{ text: "Посмотреть статистику" }]
            ],
            resize_keyboard: true
        }
    });
});

bot.hears("Создать счет-фактуру", (ctx) => {
    ctx.reply("Вы выбрали создать счет-фактуру. Далее можно реализовать соответствующую логику.");
});

bot.hears("Посмотреть статистику", (ctx) => {
    ctx.reply("Вы выбрали посмотреть статистику. Далее можно реализовать соответствующую логику.");
});

bot.launch(); 