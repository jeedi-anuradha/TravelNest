const mongoose = require('mongoose');

const HotelSchema =new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have at least one image']
  },
  type: {
    type: String,
    enum: ['1-star', '2-star', '3-star', '4-star', '5-star'],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Budget', 'Mid-range', 'Luxury'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  view: {
    type: String,
    enum: [
      "Beach View",
      "City view",
      "Lake view",
      "Resort view",
      "Pool View",
      "Forest View",
      "Street View",
      "Skyline View",
      "Mountain View"
    ],
    required: true
  }
}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model("Hotels", HotelSchema);
