const mongoose = require('mongoose')

const event = new mongoose.Schema({
    title: {
        require: true,
        type:  String
    },
    description: {
        require: true,
        type:  String
    },
  

    
});

const eventModel = mongoose.model('event', event)

module.exports = {eventModel}