const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', {
    username : {
        type: String,
        required: true
    },
    lastname : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
 });
 module.exports = Comment;
