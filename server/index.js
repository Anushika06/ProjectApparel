const express=require("express");
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const authRouter=require("./routes/auth.routes.js")
const cookieParser=require("cookie-parser")

dotenv.config()
connectDB(process.env.dbURL)

const app=express();
app.use(express.json());

app.use(cookieParser());
app.use('/api/auth',authRouter)

app.listen(3000, ()=>{
    console.log("Server is running!");
})

