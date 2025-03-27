"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import axios from "axios"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const OTPVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(420) // 7 minutes in seconds
  const [isExpired, setIsExpired] = useState(false)
  const [resendCount, setResendCount] = useState(0) // Track number of resends
  const [isResendLocked, setIsResendLocked] = useState(false) // Track if resend is locked
  const [lockTimeLeft, setLockTimeLeft] = useState(0) // Track lockout time remaining
  const [showAttempts, setShowAttempts] = useState(false) // Track whether to show attempts
  const inputRefs = useRef([])
  const timerRef = useRef(null)
  const lockTimerRef = useRef(null) // Timer for the resend lockout
  const attemptTimerRef = useRef(null) // Timer for hiding attempts count
  const formData = location.state?.formData
  const isFromSignup = location.state?.fromSignup || false // Check if coming directly from signup form

  // Prevent page refresh
  useEffect(() => {
    const preventRefresh = (e) => {
      e.preventDefault()
      e.returnValue = ""
      // Force navigation to be blocked
      window.history.pushState(null, "", window.location.href)
      return ""
    }

    // Block refresh with beforeunload
    window.addEventListener("beforeunload", preventRefresh)

    // Block navigation with popstate
    const blockNavigation = () => {
      window.history.pushState(null, "", window.location.href)
    }

    // Initialize by pushing current state
    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", blockNavigation)

    return () => {
      window.removeEventListener("beforeunload", preventRefresh)
      window.removeEventListener("popstate", blockNavigation)
    }
  }, [])

  // Initialize timer and OTP state
  useEffect(() => {
    if (!formData) {
      navigate("./signup")
      return
    }

    // Set a flag to track that we're in OTP verification
    sessionStorage.setItem("inOtpVerification", "true")

    // Start the OTP timer
    startOtpTimer()

    return () => {
      // Clear the OTP verification flag if navigating to signup
      if (window.location.pathname.includes("signup")) {
        sessionStorage.removeItem("inOtpVerification")
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (attemptTimerRef.current) {
        clearTimeout(attemptTimerRef.current)
      }
    }
  }, [navigate, formData])

  // Separate effect for lock timer
  useEffect(() => {
    // Check if we need to start the lock timer
    if (isResendLocked && lockTimeLeft > 0) {
      startLockTimer()
    }

    return () => {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current)
      }
    }
  }, [isResendLocked, lockTimeLeft])

  // Send OTP on first render
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (!formData || !formData.email) return

    if (isFirstRender.current) {
      // Skip the effect for the first render
      isFirstRender.current = false

      // Define an async function inside useEffect
      const sendInitialOTP = async () => {
        try {
          // Perform asynchronous operation, such as fetching data
          const response = await axios.post("http://127.0.0.1:5000/users/send-otp", {
            email: formData.email,
            otp: "123456", // For demo purposes
          })
          if (response.status === 200) {
            console.log("OTP sent successfully! Please check your email.")
          }
        } catch (error) {
          console.log("Failed to send OTP. Please try again.")
        }
      }

      // Call the async function
      sendInitialOTP()
    }
  }, [formData])

  // OTP Timer function - completely separate from lock timer
  const startOtpTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Don't start timer if already expired
    if (isExpired) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current)
          setIsExpired(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  // Lock Timer function - completely separate from OTP timer
  const startLockTimer = () => {
    // Clear any existing lock timer
    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current)
    }

    lockTimerRef.current = setInterval(() => {
      setLockTimeLeft((prevTime) => {
        const newTime = prevTime <= 1 ? 0 : prevTime - 1

        if (newTime <= 0) {
          clearInterval(lockTimerRef.current)
          setIsResendLocked(false)
          // Reset resend count after lockout period
          setResendCount(0)
          return 0
        }
        return newTime
      })
    }, 1000)
  }

  // Only allow numbers in OTP input
  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    if (value.length > 1) return // Prevent multiple digits

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleVerify = (e) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter the complete OTP")
      return
    }

    if (isExpired) {
      setError("OTP has expired. Please request a new one")
      return
    }

    // Here you would typically verify the OTP with your backend
    // For demo purposes, we'll assume 123456 is a valid OTP
    if (otpValue !== "123456") {
      setError("Invalid OTP. Please try again.")
      return
    }

    // Mark OTP as verified
    sessionStorage.setItem("pendingOtpVerified", "true")

    // Save user data to localStorage
    const pendingSignupData = JSON.parse(sessionStorage.getItem("pendingSignupData") || "{}")
    if (pendingSignupData) {
      // Get existing users or create empty array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().split("T")[0]

      // Create new user object
      const newUser = {
        firstName: pendingSignupData.firstName,
        lastName: pendingSignupData.lastName,
        email: pendingSignupData.email,
        username: pendingSignupData.usernameOriginal || pendingSignupData.username, // Use original case for display
        password: pendingSignupData.password,
        passwordChangeDate: formattedDate,
        uid: Date.now().toString(), // Generate a simple unique ID
        createdAt: new Date().toISOString(),
      }

      // Add to users array
      users.push(newUser)

      // Save back to localStorage
      localStorage.setItem("users", JSON.stringify(users))

      // Clear pending signup data
      sessionStorage.removeItem("pendingSignupData")
    }

    // Navigate to success page
    navigate("../verification-success")
  }

  const handleResendOTP = async () => {
    // Check if resend is locked
    if (isResendLocked) {
      return
    }

    // Show attempts count when clicked
    setShowAttempts(true)

    // Hide attempts count after 3 seconds
    if (attemptTimerRef.current) {
      clearTimeout(attemptTimerRef.current)
    }

    attemptTimerRef.current = setTimeout(() => {
      setShowAttempts(false)
    }, 3000)

    // Increment resend count
    const newResendCount = resendCount + 1
    setResendCount(newResendCount)

    // Reset OTP fields
    setOtp(["", "", "", "", "", ""])
    setError("")

    // Reset OTP timer - ensure it works for all attempts including the 3rd
    setTimeLeft(420)
    setIsExpired(false)
    startOtpTimer()

    // Check if we've reached the limit (3 attempts)
    if (newResendCount >= 3) {
      setIsResendLocked(true)
      setLockTimeLeft(600) // 10 minutes in seconds
      // Lock timer will start in the useEffect that watches isResendLocked
    }

    // Here you would typically call your backend to resend OTP
    try {
      if (formData && formData.email) {
        const response = await axios.post("http://127.0.0.1:5000/users/send-otp", {
          email: formData.email,
          otp: "123456", // For demo purposes
        })
        if (response.status === 200) {
          console.log("OTP resent successfully! Please check your email.")
        }
      }
    } catch (error) {
      console.log("Failed to resend OTP. Please try again.")
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-4 sm:p-6 min-h-[450px] mt-12 mb-12">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-3 sm:mb-2">
              OTP Verification
            </h1>
            <div className="text-white font-['comfortaa'] text-[14px] sm:text-[16px] text-center max-w-[600px] mb-3">
              <p>OTP has been sent to your registered email.</p>
              <p>Please enter it below to verify your account.</p>
              <p>For your security, OTPs are valid for {formatTime(timeLeft)} minutes only.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4 sm:space-y-2">
              <div className="flex gap-2 sm:gap-3 justify-center mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-[40px] h-[50px] sm:w-[50px] sm:h-[60px] bg-white/40 rounded-[10px] text-center text-white text-xl sm:text-2xl font-['comfortaa'] focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                ))}
              </div>

              <div className="h-4">
                {error && <p className="text-red-500 text-center font-['comfortaa'] text-xs sm:text-sm">{error}</p>}
              </div>

              <div className="flex flex-col items-center gap-1 sm:gap-2 mt-2">
                <button
                  type="submit"
                  className="w-[200px] h-[40px] sm:h-[45px] rounded-[25px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg"
                >
                  Verify
                </button>

                <p className="text-white font-['comfortaa'] text-[12px] sm:text-[14px] text-center px-4 mt-2">
                  Didn't you receive the OTP? <br />
                  <span className="font-bold">Check your Spam folder or </span>
                  {isResendLocked ? (
                    <span className="text-gray-400">Resend locked for {formatTime(lockTimeLeft)}</span>
                  ) : (
                    <button type="button" onClick={handleResendOTP} className="font-bold underline hover:text-gray-200">
                      Resend OTP {showAttempts && resendCount > 0 ? `(${resendCount}/3)` : ""}
                    </button>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OTPVerification

