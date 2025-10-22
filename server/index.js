const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes.js");
const productRouter=require("./routes/product.routes.js")
const cors = require("cors");

dotenv.config();
connectDB(process.env.dbURL);

const app = express();

app.use('/images', express.static('public/images'));

const corsOptions = {
  origin: 'http://localhost:5174', 
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/products',productRouter)

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
