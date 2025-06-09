const mongoose = require('mongoose');

const PopularSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of images']
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
    type: String
  },
  city: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Budget', 'Standard', 'Premium', 'Luxury'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  view: {
    type: String,
    enum: ['Sea View', 'Garden View', 'City View', 'Mountain View', 'Pool View', 'No View']
  }
});

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Popular', PopularSchema);
