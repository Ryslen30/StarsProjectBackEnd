const mongoose = require('mongoose');

const Star = mongoose.model('Star', {

    id : {
        type: String,
        unique : true
    },
    name : {
        type: String
    },
    photo : {
        type: String
    },
    price : {
        type: Number
    },
    state : { 
        type: Boolean,
        default: false
    },
    dateDeFormation : {
        type: Date
    },
    comments : {
        type : Array
    },
    category : {
        type: String
    },
    description : {
        type: String
    },
    likes : {
        type: Number,
        default: 13
    }
    


})
module.exports = Star;
