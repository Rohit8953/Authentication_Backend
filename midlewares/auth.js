
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth=(req,res,next)=>{
       try{
           console.log("cookie",req.cookies.token);
            const token=req.body.token||req.cookies.token||req.header("Authorization").replace("Bearer", " ");
            console.log(token);
            if(!token||token===undefined){
                return res.status(401).json({
                    success:false,
                    message:'Token missing from there',
                })
            }
            //verify the token
            try{
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user=decoded;
                console.log(decoded);
            }
            catch(error){
                console.log(error);
                return res.status(401).json({
                    success:false,
                    message:"token is invalid",
                })
            }
            next();
       }
       catch(err){
                console.log(err);
                return res.status(401).json({
                    success:false,
                    message:'Something went wrong, while verifying the token',
                })
       }
}

 

//authentication for student-----
exports.isStudent=(req,res,next)=>{
    try{
         if(req.user.role!="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students you can not enter"
            })
         }
         next();     
    }
    catch(err){
       return res.status(500).json({
        success:false,
        message:"User role is not matching",
       })    
    }
}
//authentication for admine-----
exports.isAdmine=(req,res,next)=>{
    try{
         if(req.user.role!="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin you can not enter"
            })
         }
         next();     
    }
    catch(err){
       return res.status(500).json({
        success:false,
        message:"User role is not matching",
       })    
    }
}