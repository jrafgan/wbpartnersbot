const mongoose = require('mongoose');

// Определение схемы пользователя
const TrtsSchema = new mongoose.Schema({
    chapter: String,
    number: String,
    name: String,
    docs: String,
    // Другие поля пользователя...
}, { collection : 'trts' });

TrtsSchema.index({ goodsType: 'text' });

// Создание модели пользователя
const TrtsModel = mongoose.model('TrtsModel', TrtsSchema);

module.exports = TrtsModel;