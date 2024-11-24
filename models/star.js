const mongoose = require('mongoose');

const Star = mongoose.model('Star', {
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
    comments : [
        {
        type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: [],
        }
    ],
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
