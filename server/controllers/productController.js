const Product=require('../models/product.js')

const getProducts=async(req,res)=>{
    try{
        const products=await Product.find();
        res.status(200).json(products)
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}

module.exports=getProducts