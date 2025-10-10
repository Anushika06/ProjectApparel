const mongoose=require("mongoose");
const {Schema}=mongoose;

const userSchema=new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required: true
    },
    googleId:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String
    },
    companyName:{
        type:String
    }
},{timestamps:true})

const userModel=mongoose.model('user', userSchema);

module.exports=userModel
