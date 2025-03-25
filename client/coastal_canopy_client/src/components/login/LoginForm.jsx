"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail, X } from "lucide-react"
import { signInWithGoogle } from "./firebaseConfig"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const attempts = localStorage.getItem("loginFailedAttempts")
    return attempts ? Number.parseInt(attempts) : 0
  })
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeLeft, setLockTimeLeft] = useState(0)
  const [isPasswordExpired, setIsPasswordExpired] = useState(false)
  const lockTimerRef = { current: null }

  // Check if the form is locked on component mount
  useEffect(() => {
    const lockedUntil = localStorage.getItem("loginLockedUntil")

    if (lockedUntil) {
      const lockTime = Number.parseInt(lockedUntil)
      const currentTime = new Date().getTime()

      if (lockTime > currentTime) {
        // Form is still locked
        setIsLocked(true)
        const timeLeft = Math.ceil((lockTime - currentTime) / 1000)
        setLockTimeLeft(timeLeft)
        startLockTimer()
      } else {
        // Lock has expired
        localStorage.removeItem("loginLockedUntil")
        localStorage.removeItem("loginFailedAttempts")
        setFailedAttempts(0)
        setIsLocked(false)
      }
    }
  }, [])

  // Start the lock timer
  const startLockTimer = () => {
    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current)
    }

    lockTimerRef.current = setInterval(() => {
      setLockTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(lockTimerRef.current)
          setIsLocked(false)
          localStorage.removeItem("loginLockedUntil")
          localStorage.removeItem("loginFailedAttempts")
          setFailedAttempts(0)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Check for remembered login on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    const rememberedExpiry = localStorage.getItem("rememberedExpiry")

    if (rememberedEmail && rememberedExpiry) {
      const expiryDate = new Date(rememberedExpiry)
      if (expiryDate > new Date()) {
        // Not expired yet
        setEmail(rememberedEmail)
        setRememberMe(true)
        // Auto-login if we have the credentials
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find((u) => u.email === rememberedEmail)
        if (user) {
          navigate("/")
        }
      } else {
        // Expired, clear remembered login
        localStorage.removeItem("rememberedEmail")
        localStorage.removeItem("rememberedExpiry")
      }
    }
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    setInvalidCredentials(false)

    // Check if form is locked
    if (isLocked) {
      setInvalidCredentials(true)
      setErrors({ form: `Account locked. Please try again in ${formatTime(lockTimeLeft)}.` })
      return
    }

    // Basic validation
    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // Check if password is expired (180 days)
      const isExpired = false
      if (user.passwordChangeDate) {
        const passwordChangeDate = new Date(user.passwordChangeDate)
        const today = new Date()
        const diffTime = Math.abs(today - passwordChangeDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays >= 180) {
          // Password is expired
          setIsPasswordExpired(true)
          return
        }
      }

      // Login successful
      localStorage.setItem("currentUser", JSON.stringify(user))

      // Reset failed attempts
      localStorage.removeItem("loginFailedAttempts")
      setFailedAttempts(0)

      // Handle remember me
      if (rememberMe) {
        const twoWeeksFromNow = new Date()
        twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)
        localStorage.setItem("rememberedEmail", email)
        localStorage.setItem("rememberedExpiry", twoWeeksFromNow.toISOString())
      } else {
        localStorage.removeItem("rememberedEmail")
        localStorage.removeItem("rememberedExpiry")
      }

      // Redirect to home page
      navigate("/")
    } else {
      // Login failed - increment failed attempts
      const newFailedAttempts = failedAttempts + 1
      setFailedAttempts(newFailedAttempts)
      localStorage.setItem("loginFailedAttempts", newFailedAttempts)

      // Check if we should lock the form
      if (newFailedAttempts >= 5) {
        // Lock for 10 minutes (600 seconds)
        const lockUntil = new Date().getTime() + 10 * 60 * 1000
        localStorage.setItem("loginLockedUntil", lockUntil)
        setIsLocked(true)
        setLockTimeLeft(600)
        startLockTimer()
        setErrors({ form: "Too many failed attempts. Account locked for 10 minutes." })
      } else {
        // Show invalid credentials message
        setInvalidCredentials(true)
        setErrors({ form: `Invalid email or password. (Attempt ${newFailedAttempts}/5)` })
      }
    }
  }

  const handleSocialLogin = async (platform) => {
    if (platform === "google") {
      try {
        const user = await signInWithGoogle()

        if (!user) {
          console.warn("Google Sign-In was cancelled or failed.")
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
        console.error("Google Sign-In Failed:", error.message)
      }
    }
  }

  const handleChangePassword = () => {
    setIsPasswordExpired(false)
    navigate("/login/change-password")
  }

  const handleCancelPasswordExpired = () => {
    setIsPasswordExpired(false)
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
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-4 sm:p-6 mt-12 mb-12">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-1 sm:mb-2">
              Welcome Back
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-4">
              Login to your account
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4 w-full max-w-[320px] sm:max-w-[350px]">
              <div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors({ ...errors, email: "", form: "" })
                      setInvalidCredentials(false)
                    }}
                    disabled={isLocked}
                    className="w-full h-[45px] pl-12 pr-4 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] disabled:opacity-50"
                  />
                </div>
                {/* Fixed height error container that's always present */}
                <div className="h-1 ml-4 mt-1">
                  {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}
                </div>
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setErrors({ ...errors, password: "", form: "" })
                      setInvalidCredentials(false)
                    }}
                    disabled={isLocked}
                    className="w-full h-[45px] pl-12 pr-10 rounded-[25px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                    disabled={isLocked}
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {/* Fixed height error container that's always present */}
                <div className="h-1 ml-4 mt-1">
                  {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password}</p>}
                </div>
              </div>

              {/* Fixed height container for invalid credentials message */}
              <div className="text-center">
                {(invalidCredentials || errors.form) && (
                  <p className="text-red-500 text-xs sm:text-sm">{errors.form || "Invalid email or password"}</p>
                )}
                {isLocked && (
                  <p className="text-red-500 text-xs sm:text-sm">
                    Account locked. Try again in {formatTime(lockTimeLeft)}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-white font-['comfortaa'] text-[12px] sm:text-[14px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white flex items-center justify-center
                      ${rememberMe ? "bg-white" : ""}`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-2 h-2 sm:w-3 sm:h-3 text-black"
                        fill="none"
                        stroke="currentColor"
                      >
                        <polyline
                          points="20 6 9 17 4 12"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  Remember Me
                </label>
                <Link to="../forgot-password" className="hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLocked}
                  className="w-[85%] h-[45px] rounded-[25px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50"
                >
                  Login
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
                <p>Don't have an account?</p>
                <Link to="../signup" className="underline hover:text-gray-200">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Expired Modal */}
      {isPasswordExpired && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 max-w-sm w-[90%] relative">
            <button
              onClick={handleCancelPasswordExpired}
              className="absolute top-2 right-2 text-white hover:text-gray-300 hidden sm:block"
            >
              <X size={20} />
            </button>
            <h3 className="text-white font-['comfortaa'] text-xl font-bold mb-4 text-center">
              Your password has expired
            </h3>
            <p className="text-white font-['comfortaa'] text-center mb-6">
              For your security, you need to reset your password to continue accessing your account
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleChangePassword}
                className="px-6 py-2 bg-white/50 hover:bg-white/60 text-white font-['comfortaa'] font-bold rounded-full animate-pulse"
              >
                Change Password
              </button>
              <button
                onClick={handleCancelPasswordExpired}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-['comfortaa'] font-bold rounded-full sm:hidden"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Login

