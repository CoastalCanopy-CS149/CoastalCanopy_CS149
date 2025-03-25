import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import background from "/imgs/community_reporting/bg4.jpg";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { ArrowUp, AlertCircle, X } from "lucide-react";

export default function CommunityReporting1() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  const [image, setImage] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const mobileOrTabletRegex = /Mobi|Android|iPhone|iPad|iPod/i;
    setIsMobileOrTablet(mobileOrTabletRegex.test(userAgent));

    // Check if we have preserved form data and image from navigation
    if (location.state) {
      if (location.state.formData) {
        setFormData(location.state.formData);
      }
      if (location.state.image) {
        setImage(location.state.image);
      }
    }
  }, [location.state]);

  useEffect(() => {
    // Hide notification after 5 seconds
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const displayNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "firstName":
      case "lastName":
        // Only allow letters and spaces, no numbers or special characters
        if (!/^[A-Za-z\s]+$/.test(value) && value) {
          error = "Only letters and spaces are allowed";
          displayNotification(`${name === "firstName" ? "First name" : "Last name"} should contain only letters`);
        }
        break;
      
      case "email":
        // Basic email validation
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
          displayNotification("Invalid email format");
        }
        break;
      
      case "contactNumber":
        // Must be 10 digits starting with 0
        if (value && !/^0\d{9}$/.test(value)) {
          error = "Contact number must be 10 digits and start with 0";
          displayNotification("Contact number must be 10 digits starting with 0");
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Special handling for name fields to prevent invalid characters
    if (name === "firstName" || name === "lastName") {
      // If user tries to enter non-letter characters, show notification
      if (/[^A-Za-z\s]/.test(value)) {
        displayNotification(`${name === "firstName" ? "First name" : "Last name"} should contain only letters`);
      }
      // Allow only letters and spaces
      sanitizedValue = value.replace(/[^A-Za-z\s]/g, '');
    } 
    // Special handling for contact number
    else if (name === "contactNumber") {
      // If user tries to enter non-digit characters, show notification
      if (/[^0-9]/.test(value)) {
        displayNotification("Contact number should contain only digits");
      }
      // Allow only numbers
      sanitizedValue = value.replace(/[^0-9]/g, '');
    }
    
    setFormData({ ...formData, [name]: sanitizedValue });
    
    // Validate and set error message
    const error = validateField(name, sanitizedValue);
    
    setFormErrors({
      ...formErrors,
      [name]: error
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;
    const newErrors = {};
    const emptyFields = [];
    
    for (const [name, value] of Object.entries(formData)) {
      if (!value.trim()) {
        emptyFields.push(name);
      }
      
      const error = validateField(name, value);
      newErrors[name] = error;
      if (error) {
        isValid = false;
      }
    }
    
    setFormErrors(newErrors);
    
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(field => {
        switch(field) {
          case "firstName": return "First Name";
          case "lastName": return "Last Name";
          case "email": return "Email";
          case "contactNumber": return "Contact Number";
          default: return field;
        }
      });
      displayNotification(`Please fill in the following fields: ${fieldNames.join(", ")}`);
      return;
    }
    
    if (!isValid) {
      displayNotification("Please correct the errors in the form");
      return;
    }

    navigate("../report-anonymous", {
      state: {
        formData,
        image,
        isAnonymous: false,
        fromIdentityPage: true,
      },
    });
  };

  return (
    <div
      className="bg-cover min-h-screen bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="z-20 relative" id="top">
        <Navbar />
      </div>

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-md animate-slide-in-right">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800">{notificationMessage}</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-3 flex-shrink-0 text-red-500 hover:text-red-700 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center py-10">
        <div className="flex justify-center items-center mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen h-auto">
          <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
            {!isMobileOrTablet && (
              <div className="bg-red-500 p-2 sm:p-3 text-center font-bold rounded">
                ⚠ Please access this application from a mobile phone or tablet
                to do a reporting
              </div>
            )}

            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6 p-4 bg-white rounded-lg"
              >
                <h1 className="text-xl sm:text-2xl font-bold text-center">
                  Reporting Form
                </h1>
                <p className="text-sm text-center">
                  This information will be used for authentication purposes
                  only.
                </p>

                {[
                  { name: "firstName", label: "First Name" },
                  { name: "lastName", label: "Last Name" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "contactNumber", label: "Contact Number", placeholder: "0XXXXXXXXX" }
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="block text-md font-medium p-2 sm:p-3"
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      id={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md p-3 sm:p-2 border ${
                        formErrors[field.name] 
                          ? "border-red-500 focus:border-red-500 focus:ring focus:ring-red-200" 
                          : "border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                      } focus:ring-opacity-50`}
                      placeholder={field.placeholder || ""}
                      required
                    />
                    {formErrors[field.name] && (
                      <p className="mt-1 text-red-500 text-sm">
                        {formErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="z-20 fixed bottom-8 right-5">
          <a
            href="#top"
            className="flex items-center justify-center w-12 h-12 bg-green-600/90 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}