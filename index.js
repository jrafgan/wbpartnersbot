const express = require('express');
const {Telegraf, Markup} = require('telegraf');
const mongoose = require('mongoose');
const config = require('./config.js')
const Answer = require("./models/answerModel");
const {searchGoodsByQuery} = require("./actions/sertifikatAction");
const {wbAction} = require("./actions/wbAction");
const {fetchTrts} = require("./actions/trtsAction");
const {chZnakAction} = require("./actions/chZnakAction");
require('dotenv').config(); // Загрузка переменных окружения из файла .env

// Создание экземпляров приложения Express и бота Telegraf
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, config.mongoOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
db.once('open', async () => {
    console.log('Успешное подключение к MongoDB');
});

let lastCategory = ''; // Переменная для хранения последней выбранной категории
let awaitingQuestion = false;
let awaitingAnswer = false;
let currentQuestionIndex = 0; // Индекс текущего вопроса
let unansweredQuestions = [];


const processNextQuestion = async (ctx) => {
        const question = unansweredQuestions[currentQuestionIndex];
        await ctx.reply(`Введите ответ на вопрос (ID: ${question._id}): ${question.question}`);
        currentQuestionIndex++;
};

bot.hears('?', (ctx) => {
    const buttons = Object.keys(config.collections).map(key =>
        Markup.button.callback(config.collections[key], key)
    );
    ctx.reply('Выберите категорию:', Markup.inlineKeyboard(buttons));
});

bot.hears(process.env.ADMIN_WORD, async (ctx) => {
    try {
        unansweredQuestions = await Answer.find({ answer: '' });

        if (unansweredQuestions.length > 0) {
            awaitingAnswer = true;
            let message = 'Список вопросов без ответов:\n';

            unansweredQuestions.forEach((question, index) => {
                message += `${index + 1}. Вопрос: ${question.question} (ID: ${question._id})\n`;
            });
            await ctx.reply(message);
            // Запуск обработки первого вопроса
            await processNextQuestion(ctx);
        } else {
            await ctx.reply("Вопросов без ответов пока нет.");
        }
    } catch (error) {
        console.error('Ошибка:', error);
        ctx.reply('Произошла ошибка при выполнении запроса.');
    }
});

bot.action('chZnak', (ctx) => {
    const buttons = Object.keys(config.chZnakCollection).map(key =>
        Markup.button.callback(config.chZnakCollection[key], key)
    );
    ctx.reply('Выберите подкатегорию честного знака:', Markup.inlineKeyboard(buttons, {columns: 1}));
});

bot.action(Object.keys(config.chZnakCollection), async (ctx) => {
    try {
        const subCategory = ctx.match;
        const subCategoryValue = config.chZnakCollection[subCategory];

        await chZnakAction(subCategoryValue, ctx);
    } catch (error) {
        console.error('Error:', error);
        ctx.reply('An error occurred while processing your request.');
    }
});

bot.action('sertifikat', async (ctx) => {
    // Устанавливаем флаг активации категории 'sertifikat'
    lastCategory = 'Сертификат соответствия';
    ctx.reply(`Сертификаты. Введите ключевые слова: Например: платье или брюки`);
});

bot.action('wb', (ctx) => {
    lastCategory = 'Wildberries';
    ctx.reply(`Вы выбрали ${lastCategory}. Введите ваш вопрос:`);
});

bot.action('trts', async (ctx) => {
    lastCategory = 'ТР ТС';
    await fetchTrts(lastCategory, ctx)
});

bot.on('text', async (ctx) => {
    let userQuery = ctx.message.text;
    const queryText = `начните новый поиск отправив ? знак \nили напишите слово " нет ответа " если вы \nне нашли ответ. Я запишу ваш вопрос.`;

        if (currentQuestionIndex > 0 && currentQuestionIndex <= unansweredQuestions.length) {
            const question = unansweredQuestions[currentQuestionIndex - 1];
            await Answer.findByIdAndUpdate(question._id, { answer: userQuery });
            await ctx.reply('Ответ успешно сохранен.');
            if (currentQuestionIndex === unansweredQuestions.length) {
                awaitingAnswer = false;
                unansweredQuestions = [];
                currentQuestionIndex = 0;
            }
            await processNextQuestion(ctx); // Обработка следующего вопроса
        }
    // Если пользователь написал "нет ответа", ожидаем вопрос
    if (userQuery.toLowerCase() === 'нет ответа') {
        awaitingQuestion = true;
        await ctx.reply('Пожалуйста, напишите свой вопрос.');
    } else if (awaitingQuestion) { // Если ожидается вопрос и пользователь его написал
        awaitingQuestion = false; // Сброс флага ожидания вопроса

        // Сохраняем вопрос в базе данных
        const question = new Answer({
            question: userQuery,
            answer: ''
        });
        await question.save();

        // Отправляем сообщение об успешном сохранении вопроса
        await ctx.reply('Ваш вопрос успешно сохранен. Спасибо!');
    } else {
        // Обработка вопросов в зависимости от категории или другой логики
        switch (lastCategory) {
            case 'Честный знак':
                ctx.reply(queryText);
                break;
            case 'Сертификат соответствия':
                // Передаем текст запроса и контекст бота для обработки запроса
                await searchGoodsByQuery(userQuery, ctx);
                ctx.reply(queryText);
                break;
            case 'Wildberries':
                await wbAction(userQuery, ctx);
                ctx.reply(queryText);
                break;
            case 'ТР ТС':
                ctx.reply(queryText);
                break;
            default:
                console.log('Неизвестная категория');
        }
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
