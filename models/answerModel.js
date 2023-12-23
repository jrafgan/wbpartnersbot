const mongoose = require('mongoose');

// Определение схемы пользователя
const AnswerSchema = new mongoose.Schema({
    question: String,
    answer: String,
    // Другие поля пользователя...
}, {collection: 'wb'});

// Создание модели пользователя
const AnswerModel = mongoose.model('Answer', AnswerSchema);

module.exports = AnswerModel;