const AnswerModel = require('../models/answerModel');

async function wbAction(userQuery, ctx) {
    try {
        const resultsExactMatch = await AnswerModel.find({question: {$regex: new RegExp(userQuery, 'i')}});

        let message = '';
        if (resultsExactMatch.length > 0) {
            message += `Найдены точные совпадения в базе данных для запроса: ${userQuery}\n\n`;
            resultsExactMatch.forEach(item => {
                message += `${item.question}\n`;
                message += `${item.answer}\n`;
                message += '\\*********************\n\n';
            });
        }

        // Разбиение запроса пользователя на отдельные ключевые слова
        const keywords = userQuery.split(' ').map(keyword => keyword.trim());

        // Поиск по каждому ключевому слову в базе данных
        const resultsPartialMatches = await Promise.all(keywords.map(async keyword => {
            return AnswerModel.find({question: {$regex: new RegExp(keyword, 'i')}});
        }));

        // Обработка частичных совпадений и добавление в сообщение
        resultsPartialMatches.forEach(result => {
            if (result.length > 0) {
                result.forEach(item => {
                    message += `${item.question}\n`;
                    message += `${item.answer}\n`;
                    message += '\\*********************\n\n';
                });
            }
        });
        console.log(userQuery, resultsPartialMatches);
        if (message === '') {
            ctx.reply(`По запросу "${userQuery}" ничего не найдено.`);
        } else {
            ctx.reply(message);
        }
    } catch (error) {
        console.error('Ошибка поиска в базе данных:', error);
        ctx.reply('Произошла ошибка при поиске в базе данных.');
    }
}

module.exports = { wbAction };
