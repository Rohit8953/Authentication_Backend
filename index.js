const express=require('express');
const app=express();
// const cors = require('cors')

require('dotenv').config();
const PORT=process.env.PORT||6000;

//cookieparser-  what and why we need this try to find---
const cookieparser=require("cookie-parser");

//allows frontent localhost server 
// app.use(cors({origin:"http://localhost:3000", credentials:true}))

app.use(cookieparser());
app.use(express.json());

require('./config/database').dbconnection();

const user=require('./routes/user');
app.use('/api/v1', user);


app.listen(PORT,()=>{
  console.log(`app  listening at Port no:${PORT}`);
});

