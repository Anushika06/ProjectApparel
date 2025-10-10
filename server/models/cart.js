const mongoose=require("mongoose");
const {Schema}=mongoose;

const cartSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'userModel'
    },
    items:[
        {
            productId:{
                type:Schema.Types.ObjectId,
                ref:'productModel'
            },
            
        }
    ]
    
},{timestamps:true})

const cartModel=mongoose.model('cart', cartSchema);

module.exports=cartModel
