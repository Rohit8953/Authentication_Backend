const mongoose=require('mongoose');

require('dotenv').config();

exports.dbconnection=()=>{

   mongoose.connect(process.env.DATABASE_URL)
   .then(()=>{console.log("db connection successfully")})
   .catch((err)=>{
    console.log("db connection unsuccessfyl");
   })
}