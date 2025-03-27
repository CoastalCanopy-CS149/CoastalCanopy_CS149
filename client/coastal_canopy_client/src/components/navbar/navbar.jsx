"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, User, Settings, LogOut, ChevronDown, ChevronUp, Edit, Lock, X } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordAttempts, setPasswordAttempts] = useState(() => {
    const attempts = localStorage.getItem("passwordChangeAttempts")
    return attempts ? Number.parseInt(attempts) : 0
  })
  const [isPasswordLocked, setIsPasswordLocked] = useState(() => {
    const lockedUntil = localStorage.getItem("passwordChangeLockUntil")
    if (lockedUntil) {
      return new Date().getTime() < Number.parseInt(lockedUntil)
    }
    return false
  })
  const [lockTimeLeft, setLockTimeLeft] = useState(() => {
    const lockedUntil = localStorage.getItem("passwordChangeLockUntil")
    if (lockedUntil) {
      const timeLeft = Math.max(0, Math.floor((Number.parseInt(lockedUntil) - new Date().getTime()) / 1000))
      return timeLeft
    }
    return 0
  })
  const [currentUser, setCurrentUser] = useState(null)
  // Add a new state for the login popup
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const userMenuRef = useRef(null)
  const userButtonRef = useRef(null)
  const modalRef = useRef(null)
  const passwordModalRef = useRef(null)
  const lockTimerRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Map", path: "/mapping" },
    { name: "Monitoring", path: "/monitoring" },
    { name: "Reporting", path: "/reporting" },
    { name: "Learn", path: "/education" },
    { name: "AR View", path: "/ar" },
    { name: "EcoScore", path: "/gamification/" },
    { name: "Social Hub", path: "/socialMedia" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/aboutUs" },
  ]

  const navItems = menuItems.slice(0, 4)

  // Check if user is logged in - run this on every render to ensure it's always up to date
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null")
      const authUser = JSON.parse(localStorage.getItem("authUser") || "null")

      if (user) {
        setCurrentUser(user)
      } else if (authUser) {
        // For Google sign-in users
        const username = localStorage.getItem(`username_${authUser.uid}`)
        if (username) {
          setCurrentUser({
            ...authUser,
            username: username,
            firstName: authUser.displayName?.split(" ")[0] || "User",
          })
        } else {
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
    }

    // Check immediately on component mount and location change
    checkUserLoggedIn()

    // Listen for storage changes (for when user logs in/out in another tab)
    window.addEventListener("storage", checkUserLoggedIn)

    return () => {
      window.removeEventListener("storage", checkUserLoggedIn)
    }
  }, [location.pathname])

  // Start the lock timer for password attempts
  useEffect(() => {
    if (isPasswordLocked && lockTimeLeft > 0) {
      startLockTimer()
    }
  }, [isPasswordLocked, lockTimeLeft])

  const startLockTimer = () => {
    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current)
    }

    lockTimerRef.current = setInterval(() => {
      setLockTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(lockTimerRef.current)
          setIsPasswordLocked(false)
          setPasswordAttempts(0)
          localStorage.removeItem("passwordChangeLockUntil")
          localStorage.removeItem("passwordChangeAttempts")
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

  const isCurrentPath = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  // Handle hover and click events for menu
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsMenuOpen(true)
      setIsUserMenuOpen(false) // Close user menu when opening main menu
    }

    const handleUserMouseEnter = () => {
      if (currentUser) {
        setIsUserMenuOpen(true)
        setIsMenuOpen(false) // Close main menu when opening user menu
      }
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false)
        setIsSettingsExpanded(false)
      }
    }

    const menuButton = menuButtonRef.current
    const userButton = userButtonRef.current
    const menuElement = menuRef.current
    const userMenuElement = userMenuRef.current

    if (menuButton) {
      menuButton.addEventListener("mouseenter", handleMouseEnter)
    }

    if (userButton && currentUser) {
      userButton.addEventListener("mouseenter", handleUserMouseEnter)
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("mouseenter", handleMouseEnter)
      }
      if (userButton && currentUser) {
        userButton.removeEventListener("mouseenter", handleUserMouseEnter)
      }
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [currentUser])

  // Handle click outside for modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close modals when clicking outside
      // But also don't close the dropdown when modals are open
      if (isLogoutModalOpen || isPasswordModalOpen) {
        event.stopPropagation()
      }
    }

    if (isLogoutModalOpen || isPasswordModalOpen) {
      document.addEventListener("mousedown", handleClickOutside, true)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [isLogoutModalOpen, isPasswordModalOpen])

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsUserMenuOpen(false) // Close user menu when toggling main menu
  }

  const handleUserMenuToggle = () => {
    if (currentUser) {
      setIsUserMenuOpen(!isUserMenuOpen)
      setIsMenuOpen(false) // Close main menu when toggling user menu
      if (!isUserMenuOpen) {
        setIsSettingsExpanded(false)
      }
    } else {
      navigate("/login")
    }
  }

  const handleSettingsToggle = () => {
    setIsSettingsExpanded(!isSettingsExpanded)
  }

  const handleLogout = () => {
    setIsLogoutModalOpen(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("currentUser")
    setCurrentUser(null)
    setIsUserMenuOpen(false)
    setIsLogoutModalOpen(false)
    navigate("/login")
  }

  const cancelLogout = () => {
    setIsLogoutModalOpen(false)
  }

  const handleChangePassword = () => {
    setCurrentPassword("")
    setPasswordError("")
    navigate("/login/change-password")
    // setIsPasswordModalOpen(true)
  }

  const verifyPassword = () => {
    if (isPasswordLocked) {
      setPasswordError(`Please wait ${formatTime(lockTimeLeft)} before trying again.`)
      return
    }

    if (!currentPassword) {
      setPasswordError("Please enter your current password")
      return
    }
    console.log("NA")
    // Verify the password
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (user.password === currentPassword) {
        console.log("Password change screen")
        return
      // Password is correct
      setIsPasswordModalOpen(false)
      setCurrentPassword("")
      setPasswordError("")
      setPasswordAttempts(0)
      localStorage.removeItem("passwordChangeAttempts")
      navigate("/login/change-password")
    } else {
      // Password is incorrect
      const newAttempts = passwordAttempts + 1
      setPasswordAttempts(newAttempts)
      localStorage.setItem("passwordChangeAttempts", newAttempts.toString())

      if (newAttempts >= 5) {
        // Lock for 10 minutes
        const lockUntil = new Date().getTime() + 10 * 60 * 1000
        localStorage.setItem("passwordChangeLockUntil", lockUntil.toString())
        setIsPasswordLocked(true)
        setLockTimeLeft(600) // 10 minutes in seconds
        startLockTimer()
        setPasswordError("Too many failed attempts. Please try again in 10 minutes.")
      } else {
        setPasswordError(`Invalid password. Please try again. (Attempt ${newAttempts}/5)`)
      }
    }
  }

  const cancelPasswordVerify = () => {
    setIsPasswordModalOpen(false)
    setCurrentPassword("")
    setPasswordError("")
  }

  // Get user's first name initial
  const getUserInitial = () => {
    if (!currentUser) return ""

    if (currentUser.firstName) {
      return currentUser.firstName.charAt(0).toUpperCase()
    } else if (currentUser.username) {
      return currentUser.username.charAt(0).toUpperCase()
    } else if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase()
    }

    return "U"
  }

  // Get username for display
  const getUsername = () => {
    if (!currentUser) return ""

    if (currentUser.username) {
      // Return the username as it was entered (not lowercase)
      return currentUser.username
    } else if (currentUser.firstName) {
      return currentUser.firstName
    } else if (currentUser.email) {
      return currentUser.email.split("@")[0]
    }

    return "User"
  }

  // Handle user icon click - either open dropdown or navigate to login
  const handleUserIconClick = () => {
    if (currentUser) {
      setIsUserMenuOpen(!isUserMenuOpen)
      setIsMenuOpen(false)
    } else {
      navigate("/login")
    }
  }

  // Add a function to handle restricted navigation
  const handleRestrictedNavigation = (path) => {
    if (!currentUser) {
      navigate(path)
      // If user is not logged in, show login popup
      // setIsLoginModalOpen(true)
    } else {
      // If user is logged in, navigate to the path
      navigate(path)
    }
  }

  // Add a function to handle login button click in the popup
  const handleLoginRedirect = () => {
    setIsLoginModalOpen(false)
    navigate("/login")
  }

  // Cancel login modal
  const cancelLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  return (
    <div className="w-full top-0 z-50">
      <nav className="w-full">
        <div className="relative flex items-center justify-between px-4 sm:px-8 py-2 bg-black/40 backdrop-blur-sm">
          <Link to="/" className="flex items-center gap-1">
            <img
              src="/imgs/navbar/logo.png"
              alt="CoastalCanopy Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 rounded-full"
            />
            <span className="font-['Aclonica'] text-lg sm:text-2xl text-white">CoastalCanopy</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden md:flex items-center gap-4 sm:gap-8">
              {navItems.map((item) => {
                // const isRestricted = ["reporting", "education", "gamification", "socialMedia", "shop"].some((path) =>
                //   item.path.includes(path),
                // )
                const isRestricted = false;

                return isRestricted ? (
                  <button
                    key={item.name}
                    onClick={() => handleRestrictedNavigation(item.path)}
                    className={`text-white font-['comfortaa'] text-base sm:text-[18px] font-bold transition-all duration-200 hover:text-gray-300 ${
                      isCurrentPath(item.path) ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-white font-['comfortaa'] text-base sm:text-[18px] font-bold transition-all duration-200 hover:text-gray-300 ${
                      isCurrentPath(item.path) ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <div className="relative z-50" ref={menuRef}>
              <button
                ref={menuButtonRef}
                className="text-white hover:text-gray-300 transition-colors"
                aria-expanded={isMenuOpen}
                aria-controls="menu-items"
                onClick={handleMenuToggle}
              >
                <Menu size={24} />
              </button>

              {/* Desktop Menu Overlay */}
              {isMenuOpen && (
                <div className="absolute right-0 top-10 w-[220px] bg-black/40 backdrop-blur-sm rounded-[10px] border border-white/100 shadow-lg z-50 hidden md:block">
                  <div className="py-1">
                    {menuItems.map((item) => {
                      const isRestricted = ["reporting", "education", "gamification", "socialMedia", "shop"].some(
                        (path) => item.path.includes(path),
                      )

                      return isRestricted ? (
                        <button
                          key={item.name}
                          className={`block w-full px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-black/50 transition-colors text-center
                            ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                          onClick={() => {
                            setIsMenuOpen(false)
                            handleRestrictedNavigation(item.path)
                          }}
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-black/50 transition-colors text-center
                            ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Mobile Menu Overlay */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-10 w-[220px] bg-black/40 backdrop-blur-sm rounded-[10px] border border-black/100 shadow-lg z-50 md:hidden">
                  <div className="py-1">
                    {menuItems.map((item) => {
                      const isRestricted = ["reporting", "education", "gamification", "socialMedia", "shop"].some(
                        (path) => item.path.includes(path),
                      )

                      return isRestricted ? (
                        <button
                          key={item.name}
                          className={`block w-full px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-white/50 transition-colors text-center
                            ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            handleRestrictedNavigation(item.path)
                          }}
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`block px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-white/50 transition-colors text-center
                            ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Button - Show circle if logged in, user icon if not */}
            <div className="relative z-50" ref={userMenuRef}>
              {currentUser ? (
                <button
                  ref={userButtonRef}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 text-white font-['comfortaa'] font-bold hover:bg-white/60 transition-colors"
                  onClick={handleUserIconClick}
                >
                  <span className="flex items-center justify-center w-full h-full">{getUserInitial()}</span>
                </button>
              ) : (
                <button className="text-white hover:text-gray-300 transition-colors z-50" onClick={handleUserIconClick}>
                  <User size={24} />
                </button>
              )}

              {/* User Menu Dropdown - Only show if logged in */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 top-10 w-[220px] bg-black/40 backdrop-blur-sm rounded-[10px] border border-white/10 shadow-lg z-50">
                  <div className="py-3 px-4">
                    {/* User Avatar and Name - Vertical Layout */}
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/60 text-white font-['comfortaa'] text-lg font-bold">
                        {getUserInitial()}
                      </div>
                      <div className="text-white font-['comfortaa'] font-bold text-center">Hello {getUsername()}</div>
                    </div>

                    {/* Settings */}
                    <div className="border-t border-white/20 pt-2">
                      <button
                        className="flex items-center justify-between w-full py-2 text-white font-['comfortaa'] font-bold hover:bg-black/30 rounded-md px-2"
                        onClick={handleSettingsToggle}
                      >
                        <div className="flex items-center gap-2">
                          <Settings size={18} />
                          <span>Settings</span>
                        </div>
                        {isSettingsExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>

                      {/* Settings Submenu */}
                      {isSettingsExpanded && (
                        <div className="ml-8 mt-1 space-y-2">
                          <Link
                            to="/login/edit-profile"
                            className="flex items-center gap-2 py-1 text-white font-['comfortaa'] font-bold hover:bg-black/30 rounded-md px-2"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Edit size={16} />
                            <span>Edit Profile</span>
                          </Link>
                          <button
                            className="flex items-center gap-2 py-1 text-white font-['comfortaa'] font-bold hover:bg-black/30 rounded-md px-2 w-full text-left"
                            onClick={handleChangePassword}
                          >
                            <Lock size={16} />
                            <span>Change Password</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/20 mt-2 pt-2">
                      <button
                        className="flex items-center gap-2 w-full py-2 text-white font-['comfortaa'] font-bold hover:bg-black/30 rounded-md px-2"
                        onClick={handleLogout}
                      >
                        <LogOut size={18} />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div ref={modalRef} className="bg-black/80 backdrop-blur-md rounded-lg p-6 max-w-sm w-[90%] relative">
            <button
              onClick={cancelLogout}
              className="absolute top-2 right-2 text-white hover:text-gray-300 hidden sm:block"
            >
              <X size={20} />
            </button>
            <h3 className="text-white font-['comfortaa'] text-xl font-bold mb-4 text-center">Do you want to logout?</h3>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={confirmLogout}
                className="px-6 py-2 bg-white/50 hover:bg-white/60 text-white font-['comfortaa'] font-bold rounded-full"
              >
                Logout
              </button>
              <button
                onClick={cancelLogout}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-['comfortaa'] font-bold rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Verification Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div ref={passwordModalRef} className="bg-black/80 backdrop-blur-md rounded-lg p-6 max-w-sm w-[90%] relative">
            <button
              onClick={cancelPasswordVerify}
              className="absolute top-2 right-2 text-white hover:text-gray-300 hidden sm:block"
            >
              <X size={20} />
            </button>
            <h3 className="text-white font-['comfortaa'] text-xl font-bold mb-4 text-center">
              Please enter your current password
            </h3>

            <div className="mb-4">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isPasswordLocked}
                placeholder="Current password"
                className="w-full px-4 py-2 rounded-full bg-white/30 text-white placeholder-white/70 font-['comfortaa'] disabled:opacity-50"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 text-center font-['comfortaa']">{passwordError}</p>
              )}
              {isPasswordLocked && (
                <p className="text-red-500 text-sm mt-2 text-center font-['comfortaa']">
                  Try again in {formatTime(lockTimeLeft)}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={verifyPassword}
                disabled={isPasswordLocked}
                className="px-6 py-2 bg-white/50 hover:bg-white/60 text-white font-['comfortaa'] font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
              <button
                onClick={cancelPasswordVerify}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-['comfortaa'] font-bold rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Login Required Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 max-w-sm w-[90%] relative">
            <button
              onClick={cancelLoginModal}
              className="absolute top-2 right-2 text-white hover:text-gray-300 hidden sm:block"
            >
              <X size={20} />
            </button>
            <h3 className="text-white font-['comfortaa'] text-xl font-bold mb-4 text-center">Hey there!</h3>
            <p className="text-white font-['comfortaa'] text-center mb-6">
              Log in to unlock this feature and explore more cool stuff!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLoginRedirect}
                className="px-6 py-2 bg-white/50 hover:bg-white/60 text-white font-['comfortaa'] font-bold rounded-full animate-pulse"
              >
                Login
              </button>
              <button
                onClick={cancelLoginModal}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-['comfortaa'] font-bold rounded-full sm:hidden"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar

