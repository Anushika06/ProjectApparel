import { useState } from "react";
import { submitEnquiry } from "../api/enquiry";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    message: "",
    preferredContactMethod: "email",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      setPhoneError("Please enter a valid phone number (10-15 digits).");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "phoneNumber") {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phoneNumber)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    try {
      await submitEnquiry(formData);
      toast.success("Enquiry sent successfully!");

      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        message: "",
        preferredContactMethod: "email",
      });
      setPhoneError("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send enquiry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1>Contact Us</h1>
      <p>Have a question or a bulk order request? Let us know!</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          {phoneError && (
            <p
              style={{ color: "red", fontSize: "0.9rem", margin: "5px 0 0 0" }}
            >
              {phoneError}
            </p>
          )}
        </div>
        <div className="form-group">
          <label>Company Name (Optional)</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Preferred Contact Method</label>
          <select
            name="preferredContactMethod"
            value={formData.preferredContactMethod}
            onChange={handleChange}
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading || !!phoneError}>
          {isLoading ? "Sending..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
