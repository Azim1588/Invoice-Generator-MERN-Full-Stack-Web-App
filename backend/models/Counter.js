const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'invoice-2025'
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema); 