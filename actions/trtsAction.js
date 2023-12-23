const TrtsModel = require('../models/trtsModel'); // Replace with your actual model path

async function fetchTrts(cat, ctx) {
    try {
        const results = await TrtsModel.find();
        if (results.length > 0) {
            let message = `Найдены совпадения в базе данных для категории ${cat}: `;
            results.forEach(item => {
                message += `${item.name}\n`;
                message += `Номер ${item.number}\n`;
                message += `\\***************\n`;
            });
            ctx.reply(message, {parse_mode: 'Markdown'});
        } else {
            ctx.reply(`Совпадений в базе данных для категории ${cat} не найдено. Скорее всего, ваш товар не подлежит маркировке Честного Знака.`);
        }
    } catch (error) {
        console.error('Ошибка при data:', error);
        ctx.reply('Произошла ошибка при получении подсказок.');
    }
}

module.exports = {fetchTrts};
