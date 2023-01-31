const jwt=require("jsonwebtoken");
const Register=require("../models/regdata");


const auth =async(req,res,next)=>{
    try{

        const  token =req.cookies.jwt;
        const veryfyuser=jwt.verify(token,"mynameisankuhsdagiandyouernameiswhateytttttttt");
       const user= await Register.findOne({_id:veryfyuser._id})
       
    //    logout
       req.token=token;
       req.user =user;

       
       next();

    }catch(err){
res.Status(401).send(err);
    }
}

module.exports=auth;
 