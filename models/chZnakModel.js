const mongoose = require('mongoose');

// Определение схемы пользователя
const ChZnakSchema = new mongoose.Schema({
    category: String,
    tnved: String,
    product: String
    // Другие поля пользователя...
}, { collection : 'chZnak' });

// Создание модели пользователя
const ChZnakModel = mongoose.model('ChZnakModel', ChZnakSchema);

module.exports = ChZnakModel;