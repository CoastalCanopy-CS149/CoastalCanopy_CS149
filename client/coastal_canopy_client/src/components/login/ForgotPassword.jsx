"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Mail } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/acme"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // State for email input
  const [email, setEmail] = useState(() => {
    // Check if coming back from verification
    if (location.state?.email) {
      return location.state.email
    }
    // Check if this is a page refresh
    const savedEmail = sessionStorage.getItem("forgotPasswordEmail")
    return savedEmail || ""
  })

  // State for error message
  const [error, setError] = useState("")

  // State for tracking failed attempts
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const attempts = localStorage.getItem("forgotPasswordFailedAttempts")
    return attempts ? Number.parseInt(attempts) : 0
  })

  // State for tracking if the form is locked
  const [isLocked, setIsLocked] = useState(false)

  // State for tracking lock time remaining
  const [lockTimeLeft, setLockTimeLeft] = useState(0)

  // Reference for the lock timer
  const lockTimerRef = { current: null }

  // Track if this is a page refresh or a navigation
  const [isPageRefresh, setIsPageRefresh] = useState(() => {
    // Check if this is the first load or a refresh
    return !sessionStorage.getItem("forgotPasswordPageVisited")
  })

  // Track if we're coming back from verification
  const [isFromVerification, setIsFromVerification] = useState(() => {
    return !!location.state?.email
  })

  // Set a flag in sessionStorage to track page visits
  useEffect(() => {
    // Mark that we've visited this page
    sessionStorage.setItem("forgotPasswordPageVisited", "true")

    // This will run when component unmounts (navigating away)
    return () => {
      // Clear the flag when navigating away
      sessionStorage.removeItem("forgotPasswordPageVisited")

      // Only clear email if not going to verification
      if (!window.location.pathname.includes("reset-verification")) {
        sessionStorage.removeItem("forgotPasswordEmail")
      }
    }
  }, [])

  // Save email to session storage when it changes (for refresh persistence)
  useEffect(() => {
    sessionStorage.setItem("forgotPasswordEmail", email)
  }, [email])

  // Clear data on tab close
  useEffect(() => {
    const clearSessionData = () => {
      sessionStorage.removeItem("forgotPasswordEmail")
      sessionStorage.removeItem("forgotPasswordPageVisited")
      sessionStorage.removeItem("isFromVerification")
    }

    window.addEventListener("beforeunload", clearSessionData)
    return () => window.removeEventListener("beforeunload", clearSessionData)
  }, [])

  // Handle navigation events
  useEffect(() => {
    // If we came from verification, set a flag
    if (location.state?.email) {
      sessionStorage.setItem("isFromVerification", "true")
    }

    // If we're not coming from verification and not a refresh, clear email
    if (!location.state?.email && !isPageRefresh && !sessionStorage.getItem("isFromVerification")) {
      setEmail("")
      sessionStorage.removeItem("forgotPasswordEmail")
    }

    // Clear the verification flag after using it
    if (sessionStorage.getItem("isFromVerification") && !location.state?.email) {
      sessionStorage.removeItem("isFromVerification")
      setIsFromVerification(false)
    }
  }, [location, isPageRefresh])

  // Check if the form is locked on component mount
  useEffect(() => {
    const lockedUntil = localStorage.getItem("forgotPasswordLockedUntil")

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
        localStorage.removeItem("forgotPasswordLockedUntil")
        localStorage.removeItem("forgotPasswordFailedAttempts")
        setFailedAttempts(0)
        setIsLocked(false)
        setError("Please try again")
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
          localStorage.removeItem("forgotPasswordLockedUntil")
          localStorage.removeItem("forgotPasswordFailedAttempts")
          setFailedAttempts(0)
          setError("Please try again")
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setError("")
  }

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Check if email exists in localStorage
  const checkEmailExists = (email) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if form is locked
    if (isLocked) {
      setError(`Please wait ${formatTime(lockTimeLeft)} before trying again.`)
      return
    }

    // Validate email
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    // Check if email exists
    if (!checkEmailExists(email)) {
      // Increment failed attempts
      const newFailedAttempts = failedAttempts + 1
      setFailedAttempts(newFailedAttempts)
      localStorage.setItem("forgotPasswordFailedAttempts", newFailedAttempts)

      // Check if we should lock the form
      if (newFailedAttempts >= 5) {
        // Lock for 10 minutes (600 seconds)
        const lockUntil = new Date().getTime() + 10 * 60 * 1000
        localStorage.setItem("forgotPasswordLockedUntil", lockUntil)
        setIsLocked(true)
        setLockTimeLeft(600)
        startLockTimer()
        setError("Too many failed attempts. Please try again in 10 minutes.")
      } else {
        setError(`Email not found. Please check your email or sign up. (Attempt ${newFailedAttempts}/5)`)
      }
      return
    }

    // If email exists, store it for the verification process
    sessionStorage.setItem("resetPasswordEmail", email)

    // Reset failed attempts
    localStorage.removeItem("forgotPasswordFailedAttempts")
    setFailedAttempts(0)

    // Navigate to verification page
    navigate("../reset-verification", { state: { email } })
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
              Forgot your Password??
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-6 max-w-md">
              That's okay, it can happens!
              <br />
              We'll get you back
              <br />
              Please enter your email address associated
              <br />
              with your account.
            </p>

            <form onSubmit={handleSubmit} noValidate className="w-full max-w-[350px] space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLocked}
                  className="w-full h-[45px] sm:h-[50px] pl-12 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[16px] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {error && <p className="text-red-500 text-center font-['comfortaa'] text-xs sm:text-sm">{error}</p>}

              {isLocked && (
                <p className="text-red-500 text-center font-['comfortaa'] text-xs sm:text-sm">
                  Account locked. Try again in {formatTime(lockTimeLeft)}
                </p>
              )}

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={isLocked}
                  className="w-[60%] h-[45px] sm:h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Mail
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-white font-['acme'] text-[16px] sm:text-[18px] max-w-lg">
              <p>
                Mangroves protect the coast, and we protect your access.
                <br />
                Like mangroves holding the shore together, your account holds your
                <br />
                contributions.
                <br />
                Let's get you back in!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ForgotPassword

