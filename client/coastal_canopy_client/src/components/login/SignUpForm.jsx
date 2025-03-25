"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, User, Mail, Lock, Check, X } from "lucide-react"
import { signInWithGoogle } from "./firebaseConfig"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/acme"
import "@fontsource/adamina"

const SignUp = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Check if we're coming back from OTP verification
  const isFromOtpVerification = location.state?.formData || sessionStorage.getItem("inOtpVerification")

  // Initialize form data - only keep data if coming back from OTP verification
  const [formData, setFormData] = useState(() => {
    if (isFromOtpVerification) {
      // If coming back from OTP, use location state or session storage
      if (location.state?.formData) {
        return location.state.formData
      }

      // If this is a page refresh after OTP verification
      const savedForm = sessionStorage.getItem("signupFormData")
      if (savedForm) {
        return JSON.parse(savedForm)
      }
    }

    // Default empty form for new visits
    return {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      reenterPassword: "",
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showReenterPassword, setShowReenterPassword] = useState(false)

  // Terms and conditions checkbox - only checked if coming back from OTP verification
  const [agreeToTerms, setAgreeToTerms] = useState(!!isFromOtpVerification)

  const [errors, setErrors] = useState({})
  const [showTerms, setShowTerms] = useState(false)

  // Save form data to session storage only if coming from OTP verification
  useEffect(() => {
    if (isFromOtpVerification) {
      sessionStorage.setItem("signupFormData", JSON.stringify(formData))
    }
  }, [formData, isFromOtpVerification])

  // Clear form data when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      // Only clear if not going to verification
      if (!window.location.pathname.includes("verify")) {
        sessionStorage.removeItem("signupFormData")
        sessionStorage.removeItem("signupPageVisited")
      }
    }
  }, [])

  // Clear data on tab close or refresh (except when coming from OTP)
  useEffect(() => {
    const clearSessionData = () => {
      // Don't clear if we're coming from OTP verification
      if (!isFromOtpVerification) {
        sessionStorage.removeItem("signupFormData")
        sessionStorage.removeItem("signupPageVisited")
      }
    }

    // Clear on tab/browser close
    window.addEventListener("beforeunload", clearSessionData)

    return () => {
      window.removeEventListener("beforeunload", clearSessionData)
    }
  }, [isFromOtpVerification])

  // Handle back button on mobile for terms modal
  useEffect(() => {
    const handlePopState = (e) => {
      if (showTerms && window.innerWidth < 768) {
        e.preventDefault()
        setShowTerms(false)
        window.history.pushState(null, "", window.location.pathname)
      }
    }

    if (showTerms && window.innerWidth < 768) {
      window.history.pushState(null, "", window.location.pathname)
      window.addEventListener("popstate", handlePopState)
    }

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [showTerms])

  const validateName = (name) => {
    return /^[A-Za-z]{2,50}$/.test(name)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email address (e.g., example@email.com)"
    return ""
  }

  const validateUsername = (username) => {
    return /^(?!.*[._]{2})[a-z0-9](?:[a-z0-9._]{2,18})[a-z0-9]$/.test(username.toLowerCase())
  }

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  }

  const checkExistingEmail = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  const checkExistingUsername = (username) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((user) => user.username.toLowerCase() === username.toLowerCase())
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

    // Name validation
    if (formData.firstName && !validateName(formData.firstName)) {
      newErrors.firstName = "Name must be 2-50 letters (A-Z, a-z) with no numbers or special characters"
    }

    if (formData.lastName && !validateName(formData.lastName)) {
      newErrors.lastName = "Name must be 2-50 letters (A-Z, a-z) with no numbers or special characters"
    }

    // Email validation
    const emailError = validateEmail(formData.email)
    if (emailError) {
      newErrors.email = emailError
    } else if (checkExistingEmail(formData.email)) {
      newErrors.email = "This email is already registered. Please use another email or sign in."
    }

    // Username validation
    if (formData.username) {
      if (!validateUsername(formData.username)) {
        newErrors.username =
          "Username must be 4-20 characters, start & end with letters/numbers, can use dots or underscores along"
      } else if (checkExistingUsername(formData.username)) {
        newErrors.username = "This username is already taken. Please choose another one"
      }
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

    // Store form data in sessionStorage for OTP verification
    // Store both original case username and lowercase version
    sessionStorage.setItem(
      "pendingSignupData",
      JSON.stringify({
        ...formData,
        agreeToTerms: true, // Store agreement state
        usernameOriginal: formData.username, // Keep original case for display
        username: formData.username.toLowerCase(), // Store lowercase for uniqueness check
      }),
    )

    // Clear any existing OTP timer and data when submitting from signup form
    sessionStorage.removeItem("otpTimeLeft")
    sessionStorage.removeItem("otpExpiryTime")

    // Navigate to OTP verification with form data and fromSignup flag
    navigate("../verify", {
      state: {
        formData: { ...formData, agreeToTerms: true },
        fromSignup: true, // Add flag to indicate coming from signup form
      },
    })
  }

  const handleSocialLogin = async (platform) => {
    if (platform === "google") {
      try {
        const user = await signInWithGoogle()

        if (!user) {
          console.warn("Google Sign-Up was cancelled or failed.")
          return
        }

        console.log("Logged in user:", user)

        // Save user to localStorage
        localStorage.setItem("authUser", JSON.stringify(user))

        // Check if username exists
        const existingUsername = localStorage.getItem(`username_${user.uid}`)

        if (existingUsername) {
          console.log("Username found! Redirecting to home.")
          navigate("/")
        } else {
          console.log("No username found. Redirecting to username setup.")
          navigate("../username-setup")
        }
      } catch (error) {
        console.error("Google Sign-Up Failed:", error.message)
      }
    }
  }

  const handleEmailClick = () => {
    window.location.href = "mailto:coastalcanopy.lk@gmail.com"
  }

  const closeTerms = () => {
    setShowTerms(false)
  }

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/imgs/login/Background.jpg')`,
      }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4 relative">
        {/* Terms and Conditions Modal */}
        {showTerms && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={closeTerms}
              style={{ pointerEvents: "all" }}
            ></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[450px] h-[80vh] max-h-[600px] bg-white/90 rounded-[25px] z-[101] shadow-lg overflow-y-auto">
              <div className="absolute top-2 right-2 cursor-pointer p-2" onClick={closeTerms}>
                <X size={28} />
              </div>
              <div className="w-full max-w-[400px] bg-white/85 mx-auto mt-4 p-4 border border-gray-200">
                <h1 className="font-['Aclonica'] text-[18px] text-black text-center mb-2">
                  Welcome to CoastalCanopy.org.lk
                </h1>
                <h2 className="font-['Acme'] text-[14px] text-black text-center mb-3">
                  Read Our Terms & Conditions Before Signing Up
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">01) Acceptance of Terms</h3>
                    <p className="font-['Comfortaa'] text-[12px] text-black ml-3">
                      • By signing up, you agree to follow these terms and conditions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">02) User Responsibilities</h3>
                    <div className="ml-3 font-['Comfortaa'] text-[12px] text-black space-y-1">
                      <p>• Provide accurate and valid information during signup.</p>
                      <p>• Do not misuse the platform (e.g., false reports, spam, harmful content).</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">03) Privacy & Data Protection</h3>
                    <div className="ml-3 font-['Comfortaa'] text-[12px] text-black space-y-1">
                      <p>• Your personal information (email, name, etc.) is securely stored.</p>
                      <p>• We do not sell or share your data with third parties.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">04) Account Security</h3>
                    <div className="ml-3 font-['Comfortaa'] text-[12px] text-black space-y-1">
                      <p>• Never share your OTP with anyone.</p>
                      <p>• You are responsible for keeping your login details secure.</p>
                      <p>• Report any suspicious activity immediately.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">05) Content Ownership & Usage</h3>
                    <div className="ml-3 font-['Comfortaa'] text-[12px] text-black space-y-1">
                      <p>• Any reports, images, or data you submit remain your property.</p>
                      <p>• By posting, you allow CoastalCanopy.org.lk to use it for conservation purposes.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">06) Prohibited Activities</h3>
                    <div className="ml-3 font-['Comfortaa'] text-[12px] text-black space-y-1">
                      <p>• No illegal, abusive, or harmful actions on the platform.</p>
                      <p>• No unauthorized data access or security breaches.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">07) Account Suspension & Termination</h3>
                    <p className="font-['Comfortaa'] text-[12px] text-black ml-3">
                      • Violating these terms may result in account suspension or termination.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">08) Updates to Terms</h3>
                    <div className="ml-3 font-['Comfortaa'] text-[12px] text-black space-y-1">
                      <p>• We may update these terms from time to time.</p>
                      <p>• Continued use of the platform means you accept any changes.</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-['Adamina'] text-[14px] text-black">09) Contact Information</h3>
                    <p className="font-['Comfortaa'] text-[12px] text-black ml-3">
                      • If you have any questions, contact us at{" "}
                      <button onClick={handleEmailClick} className="text-blue-600 underline hover:text-blue-800">
                        coastalcanopy.lk@gmail.com
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-4 sm:p-6 mt-12 mb-12">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-1 sm:mb-2">
              Register
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-4">
              Create your own account
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-1 w-full max-w-[600px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full h-[45px] pl-10 pr-4 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg"
                    />
                  </div>
                  <div className="h-7 ml-4">
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full h-[45px] pl-10 pr-4 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg"
                    />
                  </div>
                  <div className="h-7 ml-4">
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-[45px] pl-10 pr-4 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg"
                    />
                  </div>
                  <div className="h-7 ml-4">
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full h-[45px] pl-10 pr-4 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg"
                    />
                  </div>
                  <div className="h-7 ml-4">
                    {errors.username && (
                      <p className="text-red-500 text-xs max-w-[300px] leading-tight">{errors.username}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  <div className="h-7 ml-4">
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type={showReenterPassword ? "text" : "password"}
                      name="reenterPassword"
                      placeholder="Re-enter Password"
                      value={formData.reenterPassword}
                      onChange={handleInputChange}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowReenterPassword(!showReenterPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                    >
                      {showReenterPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                  <div className="h-7 ml-4">
                    {errors.reenterPassword && <p className="text-red-500 text-xs">{errors.reenterPassword}</p>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-center sm:justify-between text-white font-comfortaa text-[12px] sm:text-[14px] mt-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-0 mx-auto sm:mx-0">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer
                      ${agreeToTerms ? "bg-white" : ""}`}
                    onClick={handleAgreeToTerms}
                  >
                    {agreeToTerms && <Check className="w-2 h-2 sm:w-3 sm:h-3 text-black" />}
                  </div>
                  <span>Agree with terms & conditions</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="underline hover:text-gray-200 mx-auto sm:mx-0"
                >
                  Terms & Conditions
                </button>
              </div>
              <div className="h-4 text-center">
                {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="w-[55%] h-[45px] rounded-[25px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-white font-['comfortaa'] text-[12px] sm:text-[14px]">
              <p className="mb-2">Or</p>
              <div className="flex justify-center gap-6 mb-4">
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
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
              <div className="flex items-center gap-1 sm:gap-2 justify-center">
                <p>Already have an account?</p>
                <Link to="../login" className="underline hover:text-gray-200">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SignUp

