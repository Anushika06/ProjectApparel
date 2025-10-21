const express=require("express")
const {signUp, signIn}=require("../controllers/auth.controllers.js")
const authRouter=express.Router()

authRouter.post('/signup',signUp)
authRouter.post('/signIn', signIn)

module.exports=authRouter