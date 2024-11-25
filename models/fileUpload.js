const mongoose = require('mongoose')

const fileUpload = new mongoose.Schema({
    fileName : {
        require: true,
        type:  String
    }
    
});

const fileModel = mongoose.model('uploadFile', fileUpload)

module.exports = {fileModel}