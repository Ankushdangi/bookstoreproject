  
// const bcrypt = require("bcryptjs/dist/bcrypt");
require("dotenv").config();
const express =require("express");
const hbs=require("hbs");
const path=require("path");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const cookieParsar=require("cookie-parser");
const auth=require("./middleware/auth");
const app=express();
require("./db/conn");
 const Register=require("./models/regdata");
const { rmSync } = require("fs");
const port=process.env.PORT || 7210;

const staticpath=path.join(__dirname,"../public");
const tmplatepath=path.join(__dirname , "../templates/views");
const partialpath=path.join(__dirname , "../templates/partials");
app.use(express.json());
app.use(cookieParsar());
app.use(express.urlencoded({exteded:false}))

app.use(express.static(staticpath))
 
app.set("view engine","hbs")
app.set("views",tmplatepath);
//hbs.registerPartials(path.join(__dirname+"../views/par"));
hbs.registerPartials(partialpath);

//console.log(process.env.SECRET-KEY);

app.get("/" ,(req,res)=>{
    res.render("index")
    
})
//auth me cookie ki value find karega fir page me jayega 
app.get("/secret",auth ,(req,res)=>{
// cookie value
//console.log(`this is the cookie ${req.cookies.jwt} `);
    res.render("secret")
    
})

app.get("/logout" , auth, async(req,res)=>{
    try{
res.clearCookie("jwt");

console.log("logout successfully");
   await req.user.save();
   res.render("login");

    }catch(err){
        res.status(500).send(err);
    }
    })


app.get("/register" ,(req,res)=>{
    res.render("register")
    })

    app.get("/login" ,(req,res)=>{
        res.render("login")
       })


// create a new user in database;
app.post("/regdata" ,async(req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.conformpassword;
        if(password===cpassword){
  const registeremployee=new Register({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    conformpassword:req.body.conformpassword,
    phone:req.body.phone

  })

//   athuntication jwt
const token = await registeremployee.genrateAuthtoken();

//   hashing password

//cookie
 
res.cookie("jwt",token,{
    expires:new Date(Date.now()+80000),
    httpOnly:true
})
 

 const  registered =await registeremployee.save();
res.status(201).render("index");
        }else{
            res.send("password are not macthing")
        }
        
    }catch(err){
        res.status(400).send(err);
    }
    })

    app.post("/logindata" ,async(req,res)=>{
       try{

        const email=req.body.email;
        const password=req.body.password;
        // console.log(`${email} and ${password}`);
     const useremail=  await Register.findOne({email:email});
// hashgin cachek
const isMatch = await bcrypt.compare(password,useremail.password)
// jwt login  data
const token = await useremail.genrateAuthtoken();

//console.log.apply("this is token part"+ token)

//login cookie
res.cookie("jwt",token,{
    expires:new Date(Date.now() + 80000),
    httpOnly:true,
     
});
 

 



    //  if(useremail.password===password)
    // isMatch is true
    if(isMatch){
        res.status(201).render("index");

     }else{
res.send("password are not matching");
     }
       }catch(err){
        res.status(400).send("invalid email or password"+err);
       }
        })
app.listen(port,()=>{

    console.log(`server is rnning at port no ${port}`);
})