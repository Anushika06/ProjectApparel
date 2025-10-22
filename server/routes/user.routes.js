const express=require("express")
const getCurrentUser=require("../controllers/user.controllers.js")
const isAuth = require("../middleware/isAuth.js")
const userRouter=express.Router()

userRouter.get('/current',isAuth,getCurrentUser)

module.exports=userRouter