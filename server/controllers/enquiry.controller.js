const Enquiry = require('../models/enquiry.js');

const submitEnquiry = async (req, res) =>{
    try{
        const{name, email, phoneNumber, companyName, message} = req.body;

        if(!name || !phoneNumber){
            return  res.status(400).json({message: 'Name and Phone Number are required'});
        }
        const newEnquiry = new Enquiry({
            name,
            email,
            phoneNumber,
            companyName,
            message
        });
        await newEnquiry.save();
        res.status(201).json({message: 'Enquiry submitted successfully'});
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports = {
    submitEnquiry
}   