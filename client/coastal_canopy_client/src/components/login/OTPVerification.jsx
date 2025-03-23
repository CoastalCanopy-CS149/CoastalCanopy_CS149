"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

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
  const inputRefs = useRef([])
  const timerRef = useRef(null)
  const lockTimerRef = useRef(null) // Timer for the resend lockout
  const formData = location.state?.formData

  useEffect(() => {
    if (!formData) {
      navigate("./signup")
      return
    }

    startTimer()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current)
      }
    }
  }, [navigate, formData])

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

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

  const startLockTimer = () => {
    // 10 minutes in seconds
    setLockTimeLeft(600)

    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current)
    }

    lockTimerRef.current = setInterval(() => {
      setLockTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(lockTimerRef.current)
          setIsResendLocked(false)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const handleInputChange = (index, value) => {
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
    console.log("Verifying OTP:", otpValue)
    // Navigate to success page
    navigate("../verification-success")
  }

  const handleResendOTP = () => {
    // Check if resend is locked
    if (isResendLocked) {
      return
    }

    // Increment resend count
    const newResendCount = resendCount + 1
    setResendCount(newResendCount)

    // Check if we've reached the limit (3 attempts)
    if (newResendCount >= 3) {
      setIsResendLocked(true)
      startLockTimer()
    }

    setOtp(["", "", "", "", "", ""])
    setError("")
    setTimeLeft(420)
    setIsExpired(false)
    startTimer()
    // Here you would typically call your backend to resend OTP
    console.log("Resending OTP to:", formData?.email)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
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
            <h1 className="font-['Aclonica'] text-white text-[48px] text-center mb-4">OTP Verification</h1>
            <div className="text-[#BDBDBD] font-['comfortaa'] text-[24px] text-center max-w-[800px] mb-8">
              <p>OTP has been sent to your registered email.</p>
              <p>Please enter it below to verify your account.</p>
              <p>For your security, OTPs are valid for {formatTime(timeLeft)} only.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex gap-4 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-[94px] h-[102px] bg-white/40 rounded-[20px] text-center text-white text-4xl font-['comfortaa'] focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-center font-['comfortaa'] text-sm">{error}</p>}

              <div className="flex flex-col items-center gap-4">
                <button
                  type="submit"
                  className="w-[539px] h-[82px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[32px] hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isExpired}
                >
                  Verify
                </button>

                <p className="text-white font-['comfortaa'] text-[20px] text-center">
                  Didn't you receive the OTP? Check your Spam folder or{" "}
                  {isResendLocked ? (
                    <span className="text-gray-400">Resend locked for {formatTime(lockTimeLeft)}</span>
                  ) : (
                    <button type="button" onClick={handleResendOTP} className="underline hover:text-gray-200">
                      Resend OTP {resendCount > 0 ? `(${resendCount}/3)` : ""}
                    </button>
                  )}
                </p>
              </div>
            </form>

            <button
              onClick={() => navigate("../signup", { state: { formData } })}
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

export default OTPVerification

