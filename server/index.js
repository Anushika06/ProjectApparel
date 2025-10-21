const express=require("express");
const app=express();
const dotenv=require("dotenv");
const connectDB = require("./config/db");

dotenv.config()

connectDB(process.env.dbURL)


app.use(express.json());


app.get('/', (req,res)=>{
    res.json({message:"Hello from server"});
})



app.listen(3000, ()=>{
    console.log("Server is running!");
})

