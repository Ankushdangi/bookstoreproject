const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const employeSchema=new mongoose.Schema({
    
    name:{
type :String,
required:true
    },
    email:{
        type :String,
        required:true,
        unique:true
            },
        phone:{
                type :Number,
                required:true,
                unique:true
                    },
                    password:{
                        type :String,
                        required:true,
                        unique:true
                            },

                      conformpassword:{
                        type :String,
                        required:true,
                                
                   },
                //    jwt ke liye
                   tokens:[{
                    token:{
                        type :String,
                        required:true
                    }
                   }]      
     
  
})
// genrate token jwt
employeSchema.methods.genrateAuthtoken =async function(){
try{
    const token =jwt.sign({_id:this._id.toString()},"mynameisankuhsdagiandyouernameiswhateytttttttt"  
    );
this.tokens=this.tokens.concat({token:token});


await this.save();
    return token;
}catch(err){
 res.send("the error part"+err);
}
}


// bycreipt hashing

employeSchema.pre("save",async function(next){
    if(this.isModified("password")){
    console.log(`the current password is ${this.password}`)
 
this.password =await bcrypt.hash(this.password,10)
console.log(`the current password is ${this.password}`)
// this.conformpassword 

this.conformpassword= await bcrypt.hash(this.password,10)

    }
next();
})



// now we create to  collectin


const Register = new mongoose.model("Regdata", employeSchema);

module.exports=Register;