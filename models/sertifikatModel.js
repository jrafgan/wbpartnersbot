const mongoose = require('mongoose');

// Определение схемы пользователя
const GoodsSchema = new mongoose.Schema({
    goodsType: String,
    docType: String,
    // Другие поля пользователя...
}, { collection : 'sertifikat' });

GoodsSchema.index({ goodsType: 'text' });

// Создание модели пользователя
const SertifikatModel = mongoose.model('GoodsModel', GoodsSchema);

module.exports = SertifikatModel;