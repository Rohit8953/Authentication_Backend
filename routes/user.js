const express=require('express');
const router=express.Router();
const User=require("../models/usershema")
const {login,signup}=require('../controllers/Auth');
const{auth, isStudent,isAdmine}=require('../midlewares/auth');

router.post('/login',login);
router.post('/signup',signup);

//protected route for  tests-----
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for TESTS',
    });
})

//protected route for a single midleware-----
router.get("/student",auth, isStudent,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for Students',
    });
})

router.get("/admin",auth,isAdmine,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for Admin',
    });
})

router.get("/getemail",auth, async(req,res)=>{
    try{
        const id=req.user.id;
        console.log(id);
        const user=await User.findById({id});
        res.status(200).json({
            success:true,
            user:user,
            message:'welcome the email router',
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"fat gaya code",
        })
    }
})

module.exports=router;
