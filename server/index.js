const express=require("express");
const userModel = require("./models/user");
const app=express();
const dotenv=require("dotenv");
const connectDB = require("./config/db");

dotenv.config()

connectDB(process.env.dbURL)


app.use(express.json());


app.get('/', (req,res)=>{
    res.json({message:"Hello from server"});
})

app.post('/user', async (req,res)=>{
    const{name, email, googleId}=req.body;
    const user=await userModel.create({
        name, email, googleId
    })
    return res.status(201).json({user})
})

app.listen(3000, ()=>{
    console.log("Server is running!");
})

