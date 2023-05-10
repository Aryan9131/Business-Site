require('./db/conn')
const port=process.env.PORT || 8000;
const hbs=require('hbs');
const bcrypt=require('bcrypt')
const path=require('path');
const cookieParser=require('cookie-parser');
const User=require("./models/usermsg");
const RegisterUser=require("./models/registerUser");
const auth=require('./middleware/auth')
const viewsPath=path.join(__dirname,"../templates/views");
const partialPath=path.join(__dirname,"../templates/partials");
const staticPath=path.join(__dirname,"../public");
const express=require('express');
const app=express();
app.use(express.urlencoded({extended:false}))
app.use(express.static(staticPath));
app.use(cookieParser());
app.set("view engine",'hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialPath)
app.get("/",(req,res)=>{
     res.render("index")
}) 
app.get("/contact",(req,res)=>{
    res.render("contact")
})
app.get("/secret",auth,(req,res)=>{
    res.render("secret")
})
app.get("/services",(req,res)=>{
    console.log(req.cookies.jwt); 
    res.render("services")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{ 
    res.render('login')
})
app.get("/logout",auth,async (req,res)=>{ 
    try {
        res.clearCookie("jwt");
        await req.user.save();
        res.render('index');
    } catch (error) {
        res.status(500).send(error); 
    }
})
app.get("*",(req,res)=>{
    res.status(404).send("<h1>Page Not Found</h1>");
})
app.post("/contact",async(req,res)=>{
    try {
       const userData=new User(req.body);
       await userData.save();
       res.status(201).render("index");
    } catch (error) {
        res.status(500).send(error);
    }
})
app.post("/login",async(req,res)=>{
    try {
        const password=req.body.password;
       const client=await RegisterUser.findOne({email:req.body.email});
       const trueUser= await bcrypt.compare(password,client.password)
       const token=await client.getToken();
       res.cookie('jwt',token,{
        expires:new Date(Date.now()+100000),
        httpOnly:true
       })
       if(client==null)
       {
        res.send(`<h1>Please Register Yourself</h1></br><a href="/register">Register YourSelf</a>`)
       }
      else if(trueUser)
       {
         res.render('index');
       }else{
        res.send('Invalid User Datails');
       }
    } catch (error) {
        res.status(500).send("Invalid User Details");
    }
})
app.post("/register",async(req,res)=>{
    try {
      if(req.body.name=='' || req.body.email=='' || req.body.password=='')
      {
        res.send(`<h1>Please Fill Form Correctly</h1></br><a href="/register">Register YourSelf</a> `);
      }
      else
      {
        const uName=req.body.name;
        const uEmail=req.body.email;
        const uPassword=await bcrypt.hash(req.body.password,10);
        const newRegister=new RegisterUser({
            name:uName,
            email:uEmail,
            password:uPassword
        });
        const token=await newRegister.getToken();
        res.cookie('jwt',token,{
            expires:new Date(Date.now()+500000),
            httpOnly:true
        }); 
        await newRegister.save(); 
        res.status(201).render("login"); 
      }    
    } catch (error) {
        res.status(500).send(error);   
    }
})
app.listen(port,()=>{
    console.log("Listening to the Port "+port+"...");  
});