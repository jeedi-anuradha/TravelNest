const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv')
dotenv.config()
const mongoose=require('mongoose')
const cookie_parser=require('cookie-parser')
const userRoutes=require('./Routes/AuthRoute')
const HotelRoutes=require('./Routes/HotelRoutes')
const PopularRoutes=require('./Routes/Popular')
const wishlistRoutes=require('./Routes/wishlist')
const bookingRoutes=require('./Routes/booking')


const port=process.env.PORT

const app=express();

// const URI='mongodb://127.0.0.1:27017/'
const Mongo_url=process.env.MONGO_URL
mongoose.connect(Mongo_url).then(()=>console.log('Database is connected')).catch(err=>console.log(err))

app.use(express.json())
app.use(cors())
app.use(cookie_parser())

app.use('/',userRoutes)
app.use('/',HotelRoutes)
app.use('/',PopularRoutes)
app.use('/', wishlistRoutes)
app.use('/',bookingRoutes)

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})
