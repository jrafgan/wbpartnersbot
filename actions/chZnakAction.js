const ChZnakModel = require('../models/chZnakModel');

async function chZnakAction(subCategoryValue, ctx) {
    try {
        const results = await ChZnakModel.find({category: subCategoryValue}).exec();
        if (results.length > 0) {
            let message = `Найдены совпадения в базе данных для категории ${subCategoryValue}: `;
            results.forEach(item => {
                message += `Товар: ${item.product}\n`;
                message += `ТН ВЭД: ${item.tnved}\n`;
                message += `\\***************\n`;
            });
            ctx.reply(message, {parse_mode: 'Markdown'});
        } else {
            ctx.reply(`Совпадений в базе данных для категории ${subCategoryValue} не найдено. Скорее всего, ваш товар не подлежит маркировке Честного Знака.`);
        }
    } catch (error) {
        console.error('Ошибка поиска в базе данных:', error);
        ctx.reply('Произошла ошибка при поиске в базе данных.');
    }
}

module.exports = { chZnakAction };
