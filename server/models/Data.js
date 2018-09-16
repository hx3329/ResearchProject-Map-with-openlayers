const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  Name: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Data', DataSchema);
