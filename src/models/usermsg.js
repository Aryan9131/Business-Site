const mongoose=require("mongoose");
const validator=require('validator')
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3
    },
    email:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id")
            }
        }
    },
    phone:{
        type:Number,
        require:true,
        min:10
    },
    message:{
        type:String,
        require:true,
        minLength:2
    }
})
// Creating a Collection
const User=mongoose.model("User",userSchema)
module.exports=User;