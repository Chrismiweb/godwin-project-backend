const express = require("express")
const { createEvent, getAllEvent } = require("../controller/eventController")

// const app = express()

const router = express.Router()

router.route('/createEvent').post(createEvent)
router.route('/getEvents').get(getAllEvent)


module.exports = {router}