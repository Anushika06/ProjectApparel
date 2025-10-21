const express=require("express");
const userModel = require("./models/user");
const app=express();
const dotenv=require("dotenv");
const connectDB = require("./config/db");
const passport = require('passport');
const session = require('express-session');
require('./config/passport');

dotenv.config()

connectDB(process.env.dbURL)


app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/auth'));


app.listen(3000, ()=>{
    console.log("Server is running!");
})

