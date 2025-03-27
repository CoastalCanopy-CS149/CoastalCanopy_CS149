"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/acme"

const UsernameSetup = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const attempts = localStorage.getItem("usernameSetupFailedAttempts")
    return attempts ? Number.parseInt(attempts) : 0
  })
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeLeft, setLockTimeLeft] = useState(0)
  const lockTimerRef = { current: null }

  // Check if user already has a username on component mount
  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
    if (authUser.uid) {
      const existingUsername = localStorage.getItem(`username_${authUser.uid}`)
      if (existingUsername) {
        // User already has a username, redirect to home
        navigate("/")
      }
  } else {
      // No authenticated user, redirect to login
      navigate("../username-setup")
    }
  }, [navigate])

  // Check if the form is locked on component mount
  useEffect(() => {
    const lockedUntil = localStorage.getItem("usernameSetupLockedUntil")

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
        localStorage.removeItem("usernameSetupLockedUntil")
        localStorage.removeItem("usernameSetupFailedAttempts")
        setFailedAttempts(0)
        setIsLocked(false)
        setError("Please try again")
      }
    }
  }, [])

  // Handle navigation away from page
  useEffect(() => {
    const handleNavigation = () => {
      // If user navigates away without setting username, clear auth data
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")
      if (authUser.uid && !localStorage.getItem(`username_${authUser.uid}`)) {
        localStorage.removeItem("authUser")
      }
    }

    window.addEventListener("beforeunload", handleNavigation)

    return () => {
      window.removeEventListener("beforeunload", handleNavigation)
      handleNavigation()
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
          localStorage.removeItem("usernameSetupLockedUntil")
          localStorage.removeItem("usernameSetupFailedAttempts")
          setFailedAttempts(0)
          setError("Please try again")
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  const validateUsername = (username) => {
    return /^(?!.*[._]{2})[a-z0-9](?:[a-z0-9._]{2,18})[a-z0-9]$/.test(username.toLowerCase())
  }

  const checkExistingUsername = (username) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((user) => user.username.toLowerCase() === username.toLowerCase())
  }

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleSubmit = (e) => {
    //e.preventDefault()

    // Check if form is locked
    if (isLocked) {
      setError(`Please wait ${formatTime(lockTimeLeft)} before trying again.`)
      return
    }

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    // Validate username format
    if (!validateUsername(username.toLowerCase())) {
      // Increment failed attempts
      const newFailedAttempts = failedAttempts + 1
      setFailedAttempts(newFailedAttempts)
      localStorage.setItem("usernameSetupFailedAttempts", newFailedAttempts)

      // Check if we should lock the form
      if (newFailedAttempts >= 5) {
        // Lock for 10 minutes (600 seconds)
        const lockUntil = new Date().getTime() + 10 * 60 * 1000
        localStorage.setItem("usernameSetupLockedUntil", lockUntil)
        setIsLocked(true)
        setLockTimeLeft(600)
        startLockTimer()
        setError("Too many failed attempts. Please try again in 10 minutes.")
      } else {
        setError(
          `Username must be 4-20 characters, start & end with letters/numbers, can use dots or underscores along (Attempt ${newFailedAttempts}/5)`,
        )
      }
      return
    }

    // Check if username exists
    if (checkExistingUsername(username.toLowerCase())) {
      // Increment failed attempts
      const newFailedAttempts = failedAttempts + 1
      setFailedAttempts(newFailedAttempts)
      localStorage.setItem("usernameSetupFailedAttempts", newFailedAttempts)

      // Check if we should lock the form
      if (newFailedAttempts >= 5) {
        // Lock for 10 minutes (600 seconds)
        const lockUntil = new Date().getTime() + 10 * 60 * 1000
        localStorage.setItem("usernameSetupLockedUntil", lockUntil)
        setIsLocked(true)
        setLockTimeLeft(600)
        startLockTimer()
        setError("Too many failed attempts. Please try again in 10 minutes.")
      } else {
        setError(`This username is already taken. Please choose another one. (Attempt ${newFailedAttempts}/5)`)
      }
      return
    }

    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}")

    

    // Store original case for display, but use lowercase for uniqueness check
    const userKey = `username_${authUser.uid}`
    localStorage.setItem(userKey, username) // Store original case
    localStorage.setItem("currentUsername", username)

    // Add to usernames list (lowercase for uniqueness)
    const storedUsernames = JSON.parse(localStorage.getItem("usernames") || "[]")
    const updatedUsernames = [...storedUsernames, username.toLowerCase()]
    localStorage.setItem("usernames", JSON.stringify(updatedUsernames))

    if (!username) {
      console.error("ERROR: User UID not found in localStorage!")
      return
    }

    // Reset failed attempts
    localStorage.removeItem("usernameSetupFailedAttempts")
    setFailedAttempts(0)

    console.log("Username saved successfully:", username)

    // Redirect to home page - using window.location to force a full page reload
    navigate("/");
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
              Set Up Your Username
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-6 max-w-md">
              One last step! Pick a username to get started
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-[300px] space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError("")
                  }}
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
                  className="w-[70%] h-[45px] sm:h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save & Get Started
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-white font-['acme'] text-[16px] sm:text-[18px] max-w-lg">
              <p>
                Mangroves stand tall with purpose.
                <br />
                Your username is more than just a name—it's your digital roots in this
                <br />
                ecosystem.
                <br />
                Pick one that stands tall!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default UsernameSetup

