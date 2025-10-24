const express = require("express");
// Your controller now exports signOut, so this route will work
const { signUp, signIn, signOut } = require("../controllers/auth.controllers.js");
const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/signIn', signIn);
authRouter.post('/signout', signOut); // This route will now work

module.exports = authRouter;
