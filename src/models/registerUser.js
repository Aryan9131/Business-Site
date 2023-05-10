const mongoose=require("mongoose");
const validator=require('validator')
const jwt=require('jsonwebtoken');
const registerUser=mongoose.Schema({
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
    password:{
        type:String,
        require:true,
        min:5
    },
    tokens:[
        {
            token:{
                type:String,
                require:true
            }
        }
    ]
})
//Genereting Tokens
registerUser.methods.getToken=async function() {
    try {
        const token=jwt.sign({id:this.id},'HiMynameisAryannayakfromlnctbhopal');
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send('Some Error Occured :'+error);
    }
}

// Creating a Collection
const RegisterUser=mongoose.model("RegisterUser",registerUser)
module.exports=RegisterUser;