const express = require('express');
const router = express.Router();
const Wishlist = require('../Model/Wishlist');

// ✅ Get wishlist for a user
router.get('/wishlist/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const userWishlist = await Wishlist.find({ userId });
    const hotels = userWishlist.map(item => ({
      ...item.hotel,
      id: String(item.hotel.id)
    }));

    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching wishlist:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// When adding to wishlist
router.post('/wishlist/post', async (req, res) => {
  try {
    const { userId, hotel } = req.body;

    // Ensure hotel has _id
    if (!hotel._id) {
      return res.status(400).json({ message: 'Hotel _id is required' });
    }

    // Prevent duplicate
    const existingItem = await Wishlist.findOne({
      userId,
      'hotel._id': hotel._id
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Hotel already in wishlist' });
    }

    const newItem = new Wishlist({ 
      userId, 
      hotel: {
        _id: hotel._id,  // Make sure to include this
        id: hotel.id,
        name: hotel.name,
        city: hotel.city,
        price: hotel.price,
        rating: hotel.rating,
        images: hotel.images
      }
    });
    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Remove a hotel from wishlist
router.delete('/wishlist/:userId/:hotelId', async (req, res) => {
  try {
    const { userId, hotelId } = req.params;

    if (!userId || !hotelId) {
      return res.status(400).json({ message: 'User ID and Hotel ID are required' });
    }

    const result = await Wishlist.findOneAndDelete({
      userId,
      'hotel.id': hotelId
    });

    if (!result) {
      return res.status(404).json({ message: 'Hotel not found in wishlist' });
    }

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
