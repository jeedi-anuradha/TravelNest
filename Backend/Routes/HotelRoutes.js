const express=require('express')
const router=express.Router()
const Hotels=require('../Model/HotelSchema')

router.get('/',async(req,res)=>{
    const data=await Hotels.find()
    res.json(data) 
})
router.post('/hotels',async(req,res)=>{
    const newTodo= new Hotels(req.body)
    const saveTodo= await newTodo.save()
    res.json({"status":"Saved successfully","Hotel Details":saveTodo})
})

router.put('/hotel/:id',async(req,res)=>{
    const id=req.params.id
    const updatedTodo=await Hotels.findByIdAndUpdate(id,req.body)
    res.json({"status":"updated successfully","updated Data":updatedTodo})
})
router.delete('/delete/:id',async(req,res)=>{
    const id=req.params.id
    const deleteTodo=await Hotels.findByIdAndDelete(id)
    res.json({"status":"Deleted succefully","deleted Hotel":deleteTodo})
})
module.exports=router