const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', {
    username : {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    },
 
 });
 module.exports = Comment;
