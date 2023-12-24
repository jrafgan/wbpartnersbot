const config = require("./config");
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
        const documents = config.trtsDB;

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
