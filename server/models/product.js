const mongoose=require("mongoose");
const {Schema}=mongoose;

const productSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    basePrice:{
        type:Number,
        required:true
    },
    fabric:{
        type:String
    },
    description:{
        type:String
    },
    availableSizes:{
        type:[String]
    },
    availableColors:{
        type:[String]
    },
    images:[String] 
},{timestamps:true})

const productModel=mongoose.model('products', productSchema);

module.exports=productModel
