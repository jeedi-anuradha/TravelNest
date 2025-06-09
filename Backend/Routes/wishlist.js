const express = require('express')
const router = express.Router()
const Wishlist = require('../Model/Wishlist')  // Changed variable name to uppercase (convention for models)

// Get wishlist Hotels
router.get('/wishlist/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        const userWishlist = await Wishlist.find({ userId })  // Using the model correctly
        // Return just the hotel objects from each wishlist item
        const hotels = userWishlist.map(item => item.hotel)
        const normalizedHotels = hotels.map(hotel => ({
            ...hotel,
            id: String(hotel.id) // Force string IDs for consistency
        }));
        
        res.status(200).json(normalizedHotels);
        // res.status(200).json(hotels)
    } catch (error) {
        console.error('Error fetching wishlist:', error.message)
        res.status(500).json({ message: 'Server error' })  // Always send a response
    }
})

// ADD to wishlist
router.post('/wishlist/post', async (req, res) => {
    try {
        const { userId, hotel } = req.body
        if (!userId || !hotel) {  // Added check for hotel
            return res.status(400).json({
                message: 'User ID and hotel data are required'
            })
        }
        
        // Check if hotel already exists in user's wishlist
        const existingItem = await Wishlist.findOne({ 
            userId, 
            'hotel.id': hotel.id 
        })
        
        if (existingItem) {
            return res.status(400).json({
                message: 'Hotel already in wishlist'
            })
        }
        
        const newItem = new Wishlist({
            userId,
            hotel
        })
        
        await newItem.save()
        res.status(201).json(newItem)  // 201 for resource created
    } catch (error) {
        console.error('Error adding to wishlist:', error.message)
        res.status(500).json({ message: 'Server error' })
    }
})

// Remove from wishlist
router.delete('/wishlist/:userId/:hotelId', async (req, res) => {
    try {
        const { userId, hotelId } = req.params
        if (!userId || !hotelId) {  // Added check for hotelId
            return res.status(400).json({
                message: 'User ID and Hotel ID are required'
            })
        }
        
        const result = await Wishlist.findOneAndDelete({
            userId,
            "hotel.id": hotelId
        })
        
        if (!result) {
            return res.status(404).json({
                message: 'Hotel not found in wishlist'
            })
        }
        
        res.status(200).json({ message: "Removed from wishlist" })
    } catch (error) {
        console.error('Error removing from wishlist:', error.message)
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router