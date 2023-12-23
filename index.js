const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const mongoose = require('mongoose');
const config = require('./config.js')
const { searchGoodsByQuery } = require("./actions/sertifikatAction");
const { wbAction } = require("./actions/wbAction");
const {fetchTrts} = require("./actions/trtsAction");
const { chZnakAction } = require("./actions/chZnakAction");
require('dotenv').config(); // Загрузка переменных окружения из файла .env

// Создание экземпляров приложения Express и бота Telegraf
const app = express();
const bot = new Telegraf('6834751212:AAEoFFdjsX2D8cgFHRUw2ZX1-Q7z_VzT2nc'); // Укажите здесь свой токен Telegram бота

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, config.mongoOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', async () => {
    console.log('Успешное подключение к MongoDB');
});

let lastCategory = ''; // Переменная для хранения последней выбранной категории

bot.hears('?', (ctx) => {
    const buttons = Object.keys(config.collections).map(key =>
        Markup.button.callback(config.collections[key], key)
    );
    ctx.reply('Выберите категорию:', Markup.inlineKeyboard(buttons));
});

bot.action('chZnak', (ctx) => {
    const buttons = Object.keys(config.chZnakCollection).map(key =>
        Markup.button.callback(config.chZnakCollection[key], key)
    );
    ctx.reply('Выберите подкатегорию честного знака:', Markup.inlineKeyboard(buttons, {columns: 1}));
    // Дополнительный код для этой категории
});

bot.action(Object.keys(config.chZnakCollection), async (ctx) => {
    try {
        const subCategory = ctx.match;
        const subCategoryValue = config.chZnakCollection[subCategory];

        // Call the function from the separate file to perform the database search
        await chZnakAction(subCategoryValue, ctx);
    } catch (error) {
        console.error('Error:', error);
        ctx.reply('An error occurred while processing your request.');
    }
});

bot.action('sertifikat', async (ctx) => {
    // Устанавливаем флаг активации категории 'sertifikat'
    lastCategory = 'Сертификат соответствия';
    ctx.reply(`Вы брали Сертификаты. Введите ключевые слова:`);
});

bot.action('wb', (ctx) => {
    lastCategory = 'Wildberries';
    ctx.reply(`Вы выбрали ${lastCategory}. Введите ваш вопрос:`);
    // Дополнительный код для этой категории
});

bot.action('trts', async (ctx) => {
    lastCategory = 'ТР ТС';
    await fetchTrts(lastCategory, ctx)
    // Дополнительный код для этой категории
});

// bot.on('text', async (ctx) => {
//     const userQuery = ctx.message.text; // Получаем текст запроса пользователя
//     // Передаем текст запроса и контекст бота для обработки запроса
//     await searchGoodsByQuery(userQuery, ctx);
// });

bot.on('text', async (ctx) => {
    let userQuery = ctx.message.text;
    switch (lastCategory) {
        case 'Честный знак':
            ctx.reply(`Выберите подкатегорию честного знака:`);
            break;
        case 'Сертификат соответствия':
            ctx.reply(`Вы выбрали категорию СЕртификат`);// Получаем текст запроса пользователя

            // Передаем текст запроса и контекст бота для обработки запроса
            await searchGoodsByQuery(userQuery, ctx);
            break;
        case 'Wildberries':
            await wbAction(userQuery, ctx);
            ctx.reply(`Вы выбрали категорию ВБ`);
            break;
        case 'ТР ТС':
            ctx.reply(`Вы выбрали категорию ТР ТС`);
            break;
        default:
            console.log('Неизвестная категория');
    }
});

// Запуск бота
bot.launch()
    .then(() => console.log('Бот запущен'))
    .catch((err) => console.error('Ошибка запуска бота:', err));

// Настройка Express для обработки входящих HTTP-запросов
app.use(express.json());

const botPort = process.env.BOT_PORT || 3000; // Установка порта для сервера Express

// Запуск Express сервера для бота
app.listen(botPort, () => {
    console.log(`Сервер Express для бота запущен на порту ${botPort}`);
});
