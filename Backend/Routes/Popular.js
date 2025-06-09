// http://localhost:3001/popular

const express = require('express')
const router = express.Router()
const Popular_Hotels = require('../Model/popularSchema')

router.get("/popular", async (req, res) => {
    const data = await Popular_Hotels.find()
    res.json(data)
})
router.post('/popular', async (req, res) => {
    const newHotel = new Popular_Hotels(req.body)
    const saveHotel = await newHotel.save()
    res.json({ "status": "Saved successfully", "Hotel Details": saveHotel})
})
module.exports=router