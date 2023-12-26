const config = require("./config");
const {MongoClient} = require('mongodb');
require('dotenv').config();

// Подключение к MongoDB
const uri = process.env.MONGO_URI; // URI вашей MongoDB
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

// bot.on('text', async (ctx) => {
//     let userQuery = ctx.message.text;
//     const queryText = `начните новый поиск отправив ? знак \nили напишите слово " нет ответа " если вы \nне нашли ответ. Я запишу ваш вопрос.`;
//
//     // Если пользователь написал "нет ответа", ожидаем вопрос
//     if (userQuery.toLowerCase() === 'нет ответа') {
//         awaitingQuestion = true;
//         await ctx.reply('Пожалуйста, напишите свой вопрос.');
//     } else if (awaitingQuestion) { // Если ожидается вопрос и пользователь его написал
//         awaitingQuestion = false; // Сброс флага ожидания вопроса
//
//         // Сохраняем вопрос в базе данных
//         const question = new Answer({
//             question: userQuery,
//             answer: ''
//         });
//         await question.save();
//
//         // Отправляем сообщение об успешном сохранении вопроса
//         await ctx.reply('Ваш вопрос успешно сохранен. Спасибо!');
//     } else {
//         // Обработка вопросов в зависимости от категории или другой логики
//         switch (lastCategory) {
//             case 'Честный знак':
//                 ctx.reply(queryText);
//                 break;
//             case 'Сертификат соответствия':
//                 // Передаем текст запроса и контекст бота для обработки запроса
//                 await searchGoodsByQuery(userQuery, ctx);
//                 ctx.reply(queryText);
//                 break;
//             case 'Wildberries':
//                 await wbAction(userQuery, ctx);
//                 ctx.reply(queryText);
//                 break;
//             case 'ТР ТС':
//                 ctx.reply(queryText);
//                 break;
//             default:
//                 console.log('Неизвестная категория');
//         }
//     }
// });

async function insertDocuments() {
    try {
        await client.connect();
        console.log('Успешное подключение к базе данных');

        const database = client.db('telegrambot'); // Название вашей базы данных
        const collection = database.collection('wb'); // Название вашей коллекции

        const documents = [];

        const result = await collection.insertMany(documents);
        console.log(`${result.insertedCount} документов успешно добавлено`);
    } catch (error) {
        console.error('Ошибка при вставке документов:', error);
    } finally {
        await client.close();
        console.log('Соединение с базой данных закрыто');
    }
}

insertDocuments();
