// get an instance of mongoose and mongoose.Schema
var mongoose     = require('mongoose'),
    Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Item', ItemSchema);