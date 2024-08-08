const User = require("../models/usershema");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require("dotenv").config();

exports.signup=async(req,res)=>{
  try {
    const { name, email, password, role } = req.body;
    const existinguser=await User.findOne({email});
    
    if (existinguser) {
      return (
        res.status(400).
        json({
          success: true,
          massege: "User  already Exists use another email",
        })
      );
    }

    //secure password----
    let hashedpassword;
    try {
      hashedpassword = await bcrypt.hash(password, 10); //jisko hash karna chahte ho uska name,10 number of rounds me
      //hash ka matlb password ko encrypt karna in other symbols//
    } catch(err){
      return res.status(500).json({
        success: false,
        massege: "Error in hashing password",
      });
    }
    //create entry in db for user
    const user = await User.create({
      name,
      email,
      password: hashedpassword,
      role,
    });

    return res.status(200).json({
      success: true,
      massege: "signup successfully completed",
    });
  } catch (error) {
      console.log(error)
      return res.status(500).json({
        success:false,
        message:"User cannot be registered"
      })
  }
};

exports.login=async(req, res)=>{
  try{
      const{email,password}=req.body;
      //validation on email and password----
      console.log("email and password",email,password);
      if(!email||!password){
        return res.status(500).json({
          success:false,
          message:"Please fill all the details"
        })
      }

      //check user is registered or not
      const user=await User.findOne({email});

      //if user is not registered
      if(!user){
          return res.status(400).json({
            success:true,
            message:"User is not registered"
          });        
      }
      
      const payload={
        email:user.email,
        id:user._id,
        role:user.role,
       }
      //verify password--- compare between entered password and stored password
      if(await bcrypt.compare(password, user.password)){
          //password get match
          let token=jwt.sign(payload,
                                    process.env.JWT_SECRET,
                                     {
                                      expiresIn:'24h'
                                    });
         
         user.token=token;
         user.password=undefined;
       
         const options={
          expires:new Date(Date.now()+5*24*60*60*1000),
          httpOnly:true,
         }
        //create coockies; Cookies are small pieces of data stored on the client's browser by websites
         res.cookie("token",token,options).status(200).json({
           success:true,
           token,
           user,  
           message:"User Logged in successfully",
         })
      }
      else{
        //password do not match
        return res.status(403).json({
          success:true,
          message:"Password incorrect hai bhai",
        })
      }
    }
  catch(err){
      console.log(err);
      return res.status(500).json({
          success:false,
          message:'Login Failure' 
      });  
  }
}
