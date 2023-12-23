const { MongoClient } = require('mongodb');
require('dotenv').config();

// Подключение к MongoDB
const uri = process.env.MONGO_URI; // URI вашей MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function insertDocuments() {
    try {
        await client.connect();
        console.log('Успешное подключение к базе данных');

        const database = client.db('telegrambot'); // Название вашей базы данных
        const collection = database.collection('wb'); // Название вашей коллекции

        // Объекты для сохранения
        const documents = [
            {
                "question": "Как зарегистрироваться на WB ?",
                "answer": "https://youtu.be/IKcrPDHR7mk"
            },
            {
                "question": "Сбор свежих ключей.",
                "answer": "https://youtu.be/7nFn7ziDmsc"
            },
            {
                "question": "Как создать карточку ?",
                "answer": "https://youtu.be/ClsdsOLozWU"
            },
            {
                "question": "Бот создающий описание",
                "answer": "@GPT_neirobot"
            },
            {
                "question": "Как отгрузить заказ по FBS",
                "answer": "https://www.youtube.com/watch?v=snXTHzwFGd8&t=4s"
            },
            {
                "question": "Как создать поставку",
                "answer": "https://youtu.be/7aGstUsy4AE"
            },
            {
                "question": "Кто делает самовыкупы ?",
                "answer": "Светлана . +996558995563"
            },
            {
                "question": "купить MPStats",
                "answer": "Максат 0507391773"
            },
            {
                "question": "Как сдать отчет по Соц. Фонду ?",
                "answer": "https://youtu.be/03CO6GAOnak"
            },
            {
                "question": "Как сдать Ежеквартальный отчет ?",
                "answer": "https://youtu.be/bblBdAhWhH4"
            },
            {
                "question": "Как выписать ЭСФ ?",
                "answer": "https://youtu.be/-Wcd7sf2PYs"
            },
            {
                "question": "Швейные цеха Кыргызстана",
                "answer": "https://t.me/dordoitextile"
            },
            {
                "question": "На какой товар нужен честный знак ?",
                "answer": "https://www.consultant.ru/document/cons_doc_LAW_297114/26cdb7be00745ba8727bc131cfd01e77eb7b0a33/"
            },
            {
                "question": "Как сделать штрихкод, баркод ?",
                "answer": "https://youtu.be/_S_ZOf1tqeo  https://barcoder.wbcon.ru/"
            },
            {
                "question": "Калькулятор себестоимости, скачать.",
                "answer": "https://docs.google.com/spreadsheets/d/1wZgvIKcFxbEBU1Q-3e5Xwd26gYdZtKwT/edit#gid=650391162"
            },
            {
                "question": "Файлы уроков",
                "answer": "https://drive.google.com/drive/folders/1e4AvGWG1BV31TZ3hjFqhvUrjJ99AcJs5?usp=sharing"
            },
            {
                "question": "Топовый бот -  ваши заказы,выкупы, остатки (по API)+ FBS",
                "answer": "@WbNinjaBot"
            },
            {
                "question": "Бот для подбора ключевиков",
                "answer": "@keysfind_bot "
            },
            {
                "question": "Бот Позиция товара по артикулу + запрос ключевика",
                "answer": "@wbpos_bot"
            },
            {
                "question": "Бот Статистка товара по ссылке (mayak.bz)",
                "answer": "@mayak_bot"
            },
            {
                "question": " Бот умеет показывать рекламные ставки на ВБ",
                "answer": "@wbRatesBot"
            },
            {
                "question": "Много возможностей, уcловно бесплатный бот",
                "answer": "@WBCON_PARSER_BOT"
            },
            {
                "question": "Обмены лайками, товарами, выкупы продвижение взаимопомощь бот",
                "answer": "@wb_like_bot   "
            },
            {
                "question": "бот по инстуркциям и помощи при работе с WB",
                "answer": "@WB_Partners_Bot"
            },
            {
                "question": "Бот при уменьшении стоимости отправляет уведомление",
                "answer": "@wb_hunter_bot"
            },
            {
                "question": "бот по выкупам",
                "answer": "@topfind_bot"
            },
            {
                "question": "да какого числа надо оплатить ?",
                "answer": "Оплачивать надо если вы уже получаете деньги на свой расчетный счет. Оплатить надо до 15 числа следующего месяца. "
            },
            {
                "question": "да какого числа надо сдать отчет ?",
                "answer": "Сдавать отчет надо до 20 числа следующего месяца. Соц Фонд надо сдавать ежемесячно. Единый налог ежеквартально: январь, апрель, июлб , октябрь."
            }
        ];

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
