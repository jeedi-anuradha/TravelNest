const mongoose=require('mongoose')
const bcrypt=require('bcrypt')

const userShema= new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Your username is required"]
    },
    email:{
        type:String,
        required:[true,"Your email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Your password is required"]
    },
    createdAt:{
        type:Date,
        default:new Date(),
    }
})

userShema.pre("save",async function(){
    this.password= await bcrypt.hash(this.password,12)
})
module.exports=mongoose.model("users",userShema)