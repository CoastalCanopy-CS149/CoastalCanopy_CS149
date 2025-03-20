"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const ResetVerification = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(() => {
    // Check if there's a saved timer value
    const savedTime = sessionStorage.getItem("otpTimeLeft")
    if (savedTime) {
      const parsedTime = Number.parseInt(savedTime, 10)
      // If time is up, return 0
      if (parsedTime <= 0) return 0
      return parsedTime
    }
    return 420 // 7 minutes in seconds
  })
  const [isExpired, setIsExpired] = useState(() => {
    // Check if OTP is already expired
    const savedTime = sessionStorage.getItem("otpTimeLeft")
    const expiryTime = sessionStorage.getItem("otpExpiryTime")

    if (expiryTime) {
      // If current time is past expiry time, it's expired
      return new Date().getTime() > Number.parseInt(expiryTime, 10)
    }

    if (savedTime) {
      return Number.parseInt(savedTime, 10) <= 0
    }

    return false
  })
  const [resendCount, setResendCount] = useState(() => {
    // Restore resend count from session storage
    const count = sessionStorage.getItem("otpResendCount")
    return count ? Number.parseInt(count, 10) : 0
  }) // Track number of resends
  const [isResendLocked, setIsResendLocked] = useState(() => {
    // Check if resend is locked
    const lockUntil = sessionStorage.getItem("otpResendLockedUntil")
    if (lockUntil) {
      return new Date().getTime() < Number.parseInt(lockUntil, 10)
    }
    return false
  }) // Track if resend is locked
  const [lockTimeLeft, setLockTimeLeft] = useState(() => {
    // Calculate lock time left
    const lockUntil = sessionStorage.getItem("otpResendLockedUntil")
    if (lockUntil) {
      const timeLeft = Math.max(0, Math.floor((Number.parseInt(lockUntil, 10) - new Date().getTime()) / 1000))
      return timeLeft
    }
    return 0
  }) // Track lockout time remaining
  const [showAttempts, setShowAttempts] = useState(false) // Track whether to show attempts
  const inputRefs = useRef([])
  const timerRef = useRef(null)
  const lockTimerRef = useRef(null) // Timer for the resend lockout
  const attemptTimerRef = useRef(null) // Timer for hiding attempts count
  const email = location.state?.email || sessionStorage.getItem("resetPasswordEmail")

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

  // Save timer state when component unmounts or user navigates away
  useEffect(() => {
    const saveTimerState = () => {
      // Save current timer state
      sessionStorage.setItem("otpTimeLeft", timeLeft.toString())
      sessionStorage.setItem("otpResendCount", resendCount.toString())

      // If resend is locked, save lock until time
      if (isResendLocked) {
        sessionStorage.setItem("otpResendLockedUntil", (new Date().getTime() + lockTimeLeft * 1000).toString())
      }
    }

    // Save state when visibility changes (user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveTimerState()
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", saveTimerState)

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", saveTimerState)
      saveTimerState()
    }
  }, [timeLeft, resendCount, isResendLocked, lockTimeLeft])

  useEffect(() => {
    if (!email) {
      navigate("../forgot-password")
      return
    }

    // Set a flag to track that we're in verification
    sessionStorage.setItem("inResetVerification", "true")

    // If we don't have an expiry time yet or we're starting fresh, set one
    if (!sessionStorage.getItem("otpExpiryTime") || timeLeft === 420) {
      const expiryTime = new Date().getTime() + timeLeft * 1000
      sessionStorage.setItem("otpExpiryTime", expiryTime.toString())
    }

    // Start or continue the timer
    startTimer()

    // Start lock timer if needed
    if (isResendLocked && lockTimeLeft > 0) {
      startLockTimer()
    }

    return () => {
      // Don't clear the verification flag if going to reset password
      if (!window.location.pathname.includes("reset-password")) {
        sessionStorage.removeItem("inResetVerification")
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current)
      }
      if (attemptTimerRef.current) {
        clearTimeout(attemptTimerRef.current)
      }
    }
  }, [navigate, email, timeLeft, isResendLocked, lockTimeLeft])

  // Update timeLeft based on expiry time when component mounts or becomes visible
  useEffect(() => {
    const updateTimeLeft = () => {
      const expiryTime = sessionStorage.getItem("otpExpiryTime")
      if (expiryTime) {
        const now = new Date().getTime()
        const expiry = Number.parseInt(expiryTime, 10)
        const remaining = Math.max(0, Math.floor((expiry - now) / 1000))

        setTimeLeft(remaining)
        if (remaining <= 0) {
          setIsExpired(true)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }
    }

    // Update immediately
    updateTimeLeft()

    // Also update when visibility changes (user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateTimeLeft()
      }
    }

    window.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Don't start timer if already expired
    if (isExpired) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        // Update session storage with current time
        const newTime = prevTime <= 1 ? 0 : prevTime - 1
        sessionStorage.setItem("otpTimeLeft", newTime.toString())

        if (newTime <= 0) {
          clearInterval(timerRef.current)
          setIsExpired(true)
          return 0
        }
        return newTime
      })
    }, 1000)
  }

  const startLockTimer = () => {
    // 10 minutes in seconds
    if (!lockTimeLeft) {
      setLockTimeLeft(600)
      const lockUntil = new Date().getTime() + 600 * 1000
      sessionStorage.setItem("otpResendLockedUntil", lockUntil.toString())
    }

    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current)
    }

    lockTimerRef.current = setInterval(() => {
      setLockTimeLeft((prevTime) => {
        const newTime = prevTime <= 1 ? 0 : prevTime - 1

        if (newTime <= 0) {
          clearInterval(lockTimerRef.current)
          setIsResendLocked(false)
          sessionStorage.removeItem("otpResendLockedUntil")
          // Reset resend count after lockout period
          setResendCount(0)
          sessionStorage.setItem("otpResendCount", "0")
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
    if (value && index < 3) {
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

    if (otpValue.length !== 4) {
      setError("Please enter the complete verification code")
      return
    }

    if (isExpired) {
      setError("Verification code has expired. Please request a new one")
      return
    }

    // Here you would typically verify the OTP with your backend
    // For demo purposes, we'll assume 1234 is a valid OTP
    if (otpValue !== "1234") {
      setError("Invalid verification code. Please try again.")
      return
    }

    // Mark OTP as verified
    sessionStorage.setItem("resetOtpVerified", "true")

    // Clear OTP session data
    sessionStorage.removeItem("otpTimeLeft")
    sessionStorage.removeItem("otpExpiryTime")
    sessionStorage.removeItem("otpResendCount")
    sessionStorage.removeItem("otpResendLockedUntil")

    // Navigate to reset password page
    navigate("../reset-password", { state: { email } })
  }

  const handleResendOTP = () => {
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
    sessionStorage.setItem("otpResendCount", newResendCount.toString())

    // Check if we've reached the limit (3 attempts)
    if (newResendCount >= 3) {
      setIsResendLocked(true)
      const lockUntil = new Date().getTime() + 600 * 1000
      sessionStorage.setItem("otpResendLockedUntil", lockUntil.toString())
      startLockTimer()
    }

    setOtp(["", "", "", ""])
    setError("")

    // Reset timer
    setTimeLeft(420)
    setIsExpired(false)
    const expiryTime = new Date().getTime() + 420 * 1000
    sessionStorage.setItem("otpTimeLeft", "420")
    sessionStorage.setItem("otpExpiryTime", expiryTime.toString())

    startTimer()

    // Here you would typically call your backend to resend OTP
    console.log("Resending verification code to:", email)
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
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-[25px] p-4 sm:p-6 min-h-[450px]">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-1 sm:mb-2">
              Verify Your Email
            </h1>
            <div className="text-white font-['comfortaa'] text-[14px] sm:text-[16px] text-center max-w-[600px] mb-6">
              <p>
                We've sent a 4-digit code to your email.
                <br />
                Enter it below to verify your account.
                <br />
                For your security, OTPs are valid for {formatTime(timeLeft)} minutes only.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex gap-3 sm:gap-4 justify-center">
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
                    className="w-[50px] h-[60px] sm:w-[60px] sm:h-[70px] bg-white/40 rounded-[20px] text-center text-white text-2xl sm:text-3xl font-['comfortaa'] focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-center font-['comfortaa'] text-xs sm:text-sm">{error}</p>}

              <div className="flex flex-col items-center gap-3 sm:gap-8">
                <button
                  type="submit"
                  className="w-[250px] h-[40px] sm:h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg"
                >
                  Verify
                </button>

                <p className="text-white font-['comfortaa'] text-[12px] sm:text-[14px] text-center px-4">
                  Didn't you receive the Verification Code?
                  <br />
                  <span className="font-bold">Check your Spam folder or </span>
                  {isResendLocked ? (
                    <span className="text-gray-400">Resend locked for {formatTime(lockTimeLeft)}</span>
                  ) : (
                    <button type="button" onClick={handleResendOTP} className="font-bold underline hover:text-gray-200">
                      Resend Code {showAttempts && resendCount > 0 ? `(${resendCount}/3)` : ""}
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

export default ResetVerification

