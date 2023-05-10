const jwt=require('jsonwebtoken');
const RegisterUser=require("../models/registerUser");
const cookieParser=require('cookie-parser');
const auth=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        const verifyUser=await jwt.verify(token,'HiMynameisAryannayakfromlnctbhopal');
        console.log(verifyUser)
        const user=await RegisterUser.findOne({_id:verifyUser.id})
        console.log(user)
        req.token=token;
        req.user =user;
        next();
    } catch (error) {
        res.send(`<h1>Error while Connecting please Login or check your Network :</h1>` +error);
    }
}
module.exports=auth;