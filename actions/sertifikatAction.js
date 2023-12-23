const GoodsModel = require('../models/sertifikatModel'); // Подставьте путь к вашей модели товаров
const mongoose = require('mongoose');

async function searchGoodsByQuery(userQuery, ctx) {
    try {
        // Поиск точного совпадения по всем словам одновременно
        const resultsExactMatch = await GoodsModel.find({goodsType: userQuery});

        let message = '';
        if (resultsExactMatch.length > 0) {
            message += `Найдены точные совпадения в базе данных для запроса: ${userQuery}\n\n`;
            resultsExactMatch.forEach(item => {
                message += `${item.goodsType}\n`;
                message += `${item.docType}\n`;
                message += '\\*********************\n\n';
            });
        }

        // Разбиение запроса пользователя на отдельные ключевые слова
        const keywords = userQuery.split(' ').map(keyword => keyword.trim());

        // Поиск по каждому ключевому слову в базе данных
        const resultsPartialMatches = await Promise.all(keywords.map(async keyword => {
            return GoodsModel.find({goodsType: {$regex: new RegExp(keyword, 'i')}});
        }));

        // Обработка частичных совпадений и добавление в сообщение
        resultsPartialMatches.forEach(result => {
            if (result.length > 0) {
                result.forEach(item => {
                    message += `${item.goodsType}\n`;
                    message += `${item.docType}\n`;
                    message += '\\*********************\n\n';
                });
            }
        });

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

module.exports = { searchGoodsByQuery };
