const express = require('express');
const router = express.Router();
const Booking = require('../Model/booking');

router.post('/bookings', async (req, res) => {
  try {
    const {
      user,     // 👈 make sure this is sent from frontend now
      hotel,    // full hotel object
      checkIn,
      checkOut,
      guests,
      totalPrice
    } = req.body;

    // Check if overlapping booking exists
    const existingBooking = await Booking.findOne({
      'user': user,
      'hotel._id': hotel._id,
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) }
        }
      ]
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'You already have a booking for this hotel during the selected dates.'
      });
    }

    const newBooking = new Booking({
      user,     // directly from req.body
      hotel,
      checkIn,
      checkOut,
      guests,
      totalPrice
    });

    await newBooking.save();

    res.status(201).json({ success: true, booking: newBooking });
  } catch (error) {
    console.error('Error storing booking:', error);
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
});

router.get('/bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// 🔥 DELETE Booking by ID
router.delete('/bookings/:bookingId', async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const deleted = await Booking.findByIdAndDelete(bookingId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});


module.exports = router;
