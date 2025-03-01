"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Facebook, User, Mail, Lock, Check } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const SignUp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState(
    location.state?.formData || {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      reenterPassword: "",
    },
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showReenterPassword, setShowReenterPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email address (e.g., user@example.com)"
    return ""
  }

  const validateUsername = (username) => {
    return /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9_.]{2,18}[a-zA-Z0-9]$/.test(username)
  }

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleAgreeToTerms = () => {
    setAgreeToTerms(!agreeToTerms)
    if (!agreeToTerms) {
      setErrors((prev) => ({ ...prev, terms: "" }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    // Required fields validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")} is required`
      }
    })

    // Email validation
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    }

    // Username validation
    if (formData.username && !validateUsername(formData.username)) {
      newErrors.username =
        "Username must be 4-20 characters, start and end with letter/number, and can contain dots and underscores (not consecutive)"
    }

    // Password validation
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    }

    // Password match validation
    if (formData.password !== formData.reenterPassword) {
      newErrors.reenterPassword = "Passwords do not match"
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Navigate to OTP verification with form data
    navigate("../verify", { state: { formData } })
  }

  const handleSocialLogin = (platform) => {
    switch (platform) {
      case "facebook":
        window.location.href = "https://facebook.com/login"
        break
      case "google":
        window.location.href = "https://accounts.google.com"
        break
    }
  }

  return (
    <div
      className="min-h-screen w-screen overflow-y-auto overflow-x-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/imgs/login/Background.jpg')`,
      }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="relative w-[1000px] h-[700px] bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="font-['Aclonica'] text-white text-[40px] text-center mb-2">Register</h1>
            <p className="font-['comfortaa'] text-white text-[18px] text-center mb-6">Create your own account</p>

            <form onSubmit={handleSubmit} className="space-y-4 w-[800px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full h-[60px] pl-12 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[18px] shadow-lg"
                  />
                  {errors.firstName && <p className="text-red-500 mt-1 ml-4 text-xs">{errors.firstName}</p>}
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full h-[60px] pl-12 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[18px] shadow-lg"
                  />
                  {errors.lastName && <p className="text-red-500 mt-1 ml-4 text-xs">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full h-[60px] pl-12 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[18px] shadow-lg"
                  />
                  {errors.email && <p className="text-red-500 mt-1 ml-4 text-xs">{errors.email}</p>}
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full h-[60px] pl-12 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[18px] shadow-lg"
                  />
                  {errors.username && <p className="text-red-500 mt-1 ml-4 text-xs">{errors.username}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full h-[60px] pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[18px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  {errors.password && <p className="text-red-500 mt-1 ml-4 text-xs">{errors.password}</p>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                  <input
                    type={showReenterPassword ? "text" : "password"}
                    name="reenterPassword"
                    placeholder="Re-enter Password"
                    value={formData.reenterPassword}
                    onChange={handleInputChange}
                    className="w-full h-[60px] pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[18px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowReenterPassword(!showReenterPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                  >
                    {showReenterPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  {errors.reenterPassword && <p className="text-red-500 mt-1 ml-4 text-xs">{errors.reenterPassword}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between text-white font-comfortaa text-[16px] mt-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer
                      ${agreeToTerms ? "bg-white" : ""}`}
                    onClick={handleAgreeToTerms}
                  >
                    {agreeToTerms && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <span>Agree with terms & conditions</span>
                </div>
                <Link to="/terms" className="underline hover:text-gray-200">
                  Terms & Conditions
                </Link>
              </div>
              {errors.terms && <p className="text-red-500 text-center text-xs">{errors.terms}</p>}

              <button
                type="submit"
                className="w-[539px] h-[60px] mx-auto block rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[24px] hover:bg-white/60 transition-colors shadow-lg mt-4"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-6 text-center text-white font-['comfortaa'] text-[18px]">
              <p className="mb-4">Or</p>
              <div className="flex justify-center gap-8 mb-6">
                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <Facebook size={24} className="text-white" />
                </button>
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="white"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="white"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="white"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="white"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <p>Already have an account?</p>
                <Link to="../login" className="underline hover:text-gray-200">
                  Sign In
                </Link>
              </div>
            </div>

            <button
              onClick={() => navigate("../login")}
              className="absolute left-8 bottom-8 w-10 h-10 rounded-full bg-white flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignUp

