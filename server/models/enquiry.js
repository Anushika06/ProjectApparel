const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: String,
    phoneNumber: { type: String, required: true },
    companyName: String,
    message: String,
  },
  { timestamps: true }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
module.exports = Enquiry;
