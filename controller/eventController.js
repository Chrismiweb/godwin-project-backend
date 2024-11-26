const { eventModel } = require("../models/event")


const createEvent = async(req, res)=>{
    const {title, description} = req.body

    if(!title || !description){
        res.json({error: "please fill title and description"})
    }

    const createdEvent = new eventModel({title, description})

    if(!createdEvent){
        res.json({ error: "event was not created"})
    }
    await createdEvent.save()
   return res.json({message: "event was created successfully", success: true, createdEvent})

}

const getAllEvent = async(req, res)=>{
    const allEvents = await eventModel.find()
   return res.json({allEvents})
}

module.exports = {
    createEvent,
    getAllEvent
}