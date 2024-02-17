// import { Telegraf } from 'telegraf'
import TelegramBot from 'node-telegram-bot-api'

const token = "6928660684:AAH8rryO_0FdwaBHuGyKp6z90Rn2dPnrZKY"
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Привет! Чем могу помочь?");
    // Отправка клавиатуры с выбором действий
    bot.sendMessage(msg.chat.id, "Выберите действие:", {
        reply_markup: {
            keyboard: [
                [{ text: "Создать счет-фактуру" }],
                [{ text: "Посмотреть статистику" }]
            ],
            resize_keyboard: true
        }
    });
});

bot.onText(/Создать счет-фактуру/, (msg) => {
    bot.sendMessage(msg.chat.id, "Вы выбрали создать счет-фактуру. Далее можно реализовать соответствующую логику.");
});

bot.onText(/Посмотреть статистику/, (msg) => {
    bot.sendMessage(msg.chat.id, "Вы выбрали посмотреть статистику. Далее можно реализовать соответствующую логику.");
});