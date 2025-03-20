"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff, Lock } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || sessionStorage.getItem("resetPasswordEmail")
  const isVerified = sessionStorage.getItem("resetOtpVerified") === "true"

  // State for form data
  const [formData, setFormData] = useState(() => {
    // Check if this is a page refresh
    const savedData = sessionStorage.getItem("resetPasswordFormData")
    return savedData
      ? JSON.parse(savedData)
      : {
          password: "",
          confirmPassword: "",
        }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [isPageRefresh, setIsPageRefresh] = useState(() => {
    // Check if this is the first load or a refresh
    return !sessionStorage.getItem("resetPasswordPageVisited")
  })

  // Redirect if not verified or no email
  useEffect(() => {
    if (!email || !isVerified) {
      navigate("../forgot-password")
    }
  }, [email, isVerified, navigate])

  // Set a flag in sessionStorage to track page visits
  useEffect(() => {
    // Mark that we've visited this page
    sessionStorage.setItem("resetPasswordPageVisited", "true")

    // This will run when component unmounts (navigating away)
    return () => {
      // Clear the flag when navigating away
      sessionStorage.removeItem("resetPasswordPageVisited")

      // Clear form data when navigating away (not on refresh)
      if (!isPageRefresh) {
        sessionStorage.removeItem("resetPasswordFormData")
      }
    }
  }, [isPageRefresh])

  // Save form data to session storage when it changes (for refresh persistence)
  useEffect(() => {
    sessionStorage.setItem("resetPasswordFormData", JSON.stringify(formData))
  }, [formData])

  // Clear data on tab close
  useEffect(() => {
    const clearSessionData = () => {
      sessionStorage.removeItem("resetPasswordFormData")
      sessionStorage.removeItem("resetPasswordPageVisited")
    }

    window.addEventListener("beforeunload", clearSessionData)
    return () => window.removeEventListener("beforeunload", clearSessionData)
  }, [])

  // Prevent back button
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href)
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", preventBack)

    return () => {
      window.removeEventListener("popstate", preventBack)
    }
  }, [])

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  }

  const isOldPassword = (password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    return user && user.password === password
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    // Required fields validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    }

    // Password validation
    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    }

    // Check if it's the old password
    if (formData.password && isOldPassword(formData.password)) {
      newErrors.password = "Please use a new password, not your old one"
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Update user password in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((user) => {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...user,
          password: formData.password,
          passwordResetAt: new Date().toISOString(),
        }
      }
      return user
    })

    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Clear reset session data
    sessionStorage.removeItem("resetPasswordEmail")
    sessionStorage.removeItem("resetOtpVerified")
    sessionStorage.removeItem("inResetVerification")
    sessionStorage.removeItem("resetPasswordFormData")
    sessionStorage.removeItem("resetPasswordPageVisited")

    // Navigate to success page
    navigate("../reset-success", { state: { fromReset: true } })
  }

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/imgs/login/Background.jpg')`,
      }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-[25px] p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-1 sm:mb-2">
              Create a New Password
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-6">
              Your identity is verified! Keep your account safe by
              <br />
              create a strong and memorable password.
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
                    className="w-full h-full pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    className="w-full h-full pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="w-[60%] h-[45px] sm:h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg"
                >
                  Save
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
  )
}

export default ResetPassword

