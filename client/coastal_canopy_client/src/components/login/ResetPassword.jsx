"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import axios from "axios";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { siteConfig } from "../../constant/siteConfig";

import "@fontsource/aclonica";
import "@fontsource/comfortaa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || sessionStorage.getItem("newUserEmail");
  const [isVerified, setIsVerified] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not verified
  // useEffect(() => {
  //   if (!isVerified || !email) {
  //     navigate("../forgot-password");
  //   }
  // }, [navigate, isVerified, email]);

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const checkOldPassword = async (password) => {
    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/check-current-password`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if(response.status === 200)  return true
    } catch (error) {
      console.error("Error checking password:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors = {};

    // Basic validation
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
     

      // Submit new password
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/reset-password`,
        { email, password: formData.password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        // Clear session data
        setIsVerified(true);
        sessionStorage.removeItem("resetPasswordEmail");
        sessionStorage.removeItem("resetOtpVerified");
        sessionStorage.removeItem("inResetVerification");
        sessionStorage.removeItem("resetPasswordFormData");
        sessionStorage.removeItem("resetPasswordPageVisited");
        console.log(response);

        navigate("../reset-success", { state: { fromReset: true } });
      }
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || "Failed to reset password. Please try again.",

      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
              Create a New Password
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-6">
              Your identity is verified! Keep your account safe by
              <br />
              creating a strong and memorable password.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-[350px] space-y-4">
              <div>
                <div className="relative h-[45px] sm:h-[45px]">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full h-full pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] shadow-lg disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <div className="h-5 ml-4">
                  {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password}</p>}
                </div>
              </div>

              <div>
                <div className="relative h-[45px] sm:h-[45px]">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full h-full pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] shadow-lg disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <div className="h-5 ml-4">
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {errors.general && (
                <div className="text-center">
                  <p className="text-red-500 text-sm">{errors.general}</p>
                </div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-[60%] h-[45px] sm:h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-white font-['comfortaa'] text-[12px] sm:text-[14px]">
              <p>
                Can't remember your password?
                <br />
                <span className="font-bold">Jot it down on a piece of paper and keep it secure.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;