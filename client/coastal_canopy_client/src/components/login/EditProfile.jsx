"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Edit, Check } from "lucide-react";
import axios from "axios";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { useAuth } from '../../context/AuthContext';
import { siteConfig } from "../../constant/siteConfig";

import "@fontsource/aclonica";
import "@fontsource/comfortaa";
import "@fontsource/acme";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user , logout} = useAuth(); // Using useAuth to get and set user
  console.log('user in profile', user);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });
  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    username: false,
  });
  const [validFields, setValidFields] = useState({
    firstName: true,
    lastName: true,
    email: true,
    username: true,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from useAuth
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    console.log(user);

    const userData = {
      firstName: user.user.firstName || "",
      lastName: user.user.lastName || "",
      email: user.user.email || "",
      username: user.user.username || "",
    };
    setFormData(userData);
    setOriginalData(userData);
  }, [user, navigate]);

  const validateName = (name) => /^[A-Za-z]{2,50}$/.test(name);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateUsername = (username) =>
    /^(?!.*[._]{2})[a-z0-9](?:[a-z0-9._]{2,18})[a-z0-9]$/.test(username.toLowerCase());

  const toggleEditable = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    if (!editableFields[field]) {
      validateField(field, formData[field]);
    }
  };

  const validateField = (field, value) => {
    let isValid = true;
    let errorMessage = "";

    switch (field) {
      case "firstName":
      case "lastName":
        if (!value) {
          isValid = false;
          errorMessage = `${field === "firstName" ? "First" : "Last"} name is required`;
        } else if (!validateName(value)) {
          isValid = false;
          errorMessage = "Name must be 2-50 letters (A-Z, a-z) with no numbers or special characters";
        }
        break;

      case "email":
        if (!value) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!validateEmail(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email address";
        }
        break;

      case "username":
        if (!value) {
          isValid = false;
          errorMessage = "Username is required";
        } else if (!validateUsername(value)) {
          isValid = false;
          errorMessage =
            "Username must be 4-20 characters, start & end with letters/numbers, can use dots or underscores";
        }
        break;

      default:
        break;
    }

    setValidFields((prev) => ({ ...prev, [field]: isValid }));
    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const allFieldsValid = Object.values(validFields).every((valid) => valid);
    if (!allFieldsValid) {
      alert("Please correct the errors in the form before submitting.");
      setIsLoading(false);
      return;
    }

    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        updatedFields[key] = formData[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      alert("No changes detected to update.");
      setIsLoading(false);
      return;
    }
    console.log('formData', formData);

    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/update-user-details`,
        { ...formData }, 
        {
          headers: { "Content-Type": "application/json" },
          
        }
      );

      if (response.status === 200) {
        
        setOriginalData(formData);
        alert("Profile updated successfully!, Please re login to see the changes.");
        logout();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitial = () =>
    user?.user.firstName?.charAt(0).toUpperCase() ||
    user?.user.username?.charAt(0).toUpperCase() ||
    user?.user.email?.charAt(0).toUpperCase() ||
    "U";

  const canSave = () =>
    Object.values(validFields).every((valid) => valid) &&
    Object.keys(formData).some((key) => formData[key] !== originalData[key]);

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url('/imgs/login/Background.jpg')` }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-4 sm:p-6 mt-12 mb-12">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-1 sm:mb-2">
              Edit Profile
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-4">
              Keep your info up to date
            </p>

            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/30 text-white font-['comfortaa'] text-2xl font-bold mb-4">
              {getUserInitial()}
            </div>

            <div className="text-white font-['comfortaa'] font-bold text-center mb-6 text-xl">
              Hello {user.user?.username || "User"}
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-[630px] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {/* First Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editableFields.firstName || isLoading}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.firstName && validFields.firstName ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("firstName")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editableFields.lastName || isLoading}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.lastName && validFields.lastName ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("lastName")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.email && validFields.email ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("email")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!editableFields.username || isLoading}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.username && validFields.username ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("username")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={!canSave() || isLoading}
                  className="w-[50%] h-[45px] sm:h-[50px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;