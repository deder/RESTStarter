// ./models/item.js
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
    type: String
});

module.exports = mongoose.model('Item', ItemSchema);