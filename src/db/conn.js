const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/businessDB").then(()=>{
console.log("Connected to DB")
}).catch((err)=>{
    console.log("DB Not Connected"+err)
})
