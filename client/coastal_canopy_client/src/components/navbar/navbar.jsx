"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
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

  const isCurrentPath = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  // Handle hover and click events for menu
  useEffect(() => {
    const handleMouseEnter = () => setIsMenuOpen(true)
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    const menuButton = menuButtonRef.current
    const menuElement = menuRef.current

    if (menuButton) {
      menuButton.addEventListener("mouseenter", handleMouseEnter)
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("mouseenter", handleMouseEnter)
      }
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
            <span className="font-['Aclonica'] text-lg sm:text-2xl text-white">
              CoastalCanopy
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="hidden md:flex items-center gap-4 sm:gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-white font-['comfortaa'] text-base sm:text-[18px] font-bold transition-all duration-200 hover:text-gray-300 ${
                    isCurrentPath(item.path) ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
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
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-black/50 transition-colors text-center
                          ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Menu Overlay */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-10 w-[220px] bg-black/40 backdrop-blur-sm rounded-[10px] border border-black/100 shadow-lg z-50 md:hidden">
                  <div className="py-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-white/50 transition-colors text-center
                          ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              className="text-white hover:text-gray-300 transition-colors z-50"
              onClick={() => navigate("/login")}
            >
              <User size={24} />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar

