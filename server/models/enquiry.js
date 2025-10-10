const mongoose=require("mongoose");
const {Schema}=mongoose;

const enquirySchema=new Schema({
    
},{timestamps:true})

const enquiryModel=mongoose.model('enquiries', enquirySchema);

module.exports=enquiryModel;
