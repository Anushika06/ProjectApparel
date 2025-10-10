const mongoose=require("mongoose");
const {Schema}=mongoose;

const orderSchema=new Schema({

},{timestamps:true})

const orderModel=mongoose.model('orders', orderSchema);

module.exports=orderModel
