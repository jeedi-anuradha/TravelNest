const mongoose=require('mongoose')

const wishList= new  mongoose.Schema({
userId: {
    type: String,  
    required: true
  },
  hotel: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] }
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})
module.exports=mongoose.model("Wishlist",wishList)