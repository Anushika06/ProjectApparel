const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: String,
    phoneNumber: String,
    companyName: String,
    message: String,
    preferredContactMethod: { type: String, required: true }, // 'email' | 'phone' | 'whatsapp'
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
module.exports = Enquiry;
