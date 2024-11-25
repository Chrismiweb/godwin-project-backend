const mongoose = require("mongoose")
require("dotenv").config()

// connect mongoose 
const connectString = process.env.connectString
async function connectMongoose (){
    await mongoose.connect(connectString)
    console.log("database was connected sucessfully")
}

module.exports = { connectMongoose};