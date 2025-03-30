"use client"

import { useState, useEffect, useRef } from "react";
import { Menu, User, Settings, LogOut, ChevronDown, ChevronUp, Edit, Lock, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import useAuth to access AuthProvider
import { getLoggedUser } from "../../helper/auth.helper";
import {getUserInitial, getUsername} from '../../helper/user.helper';

import "@fontsource/aclonica";
import "@fontsource/comfortaa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordAttempts, setPasswordAttempts] = useState(0); // Simplified, no localStorage
  const [isPasswordLocked, setIsPasswordLocked] = useState(false); // Simplified, no timer
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);


  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const modalRef = useRef(null);
  const passwordModalRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const {  logout } = useAuth(); // Use AuthProvider for user state and logout

  useEffect(() => {
    const user = getLoggedUser();
    if (user) {
      setUser(user);
      setIsUserLoggedIn(true);
    }
  },[])
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
  ];

  const navItems = menuItems.slice(0, 4);

  // Remove the useEffect for checking user login via localStorage
  // We now rely on AuthProvider's isUserLoggedIn and user

  // Remove the lock timer logic since we're simplifying password change attempts
  // No need for lockTimeLeft, startLockTimer, or related localStorage

  const isCurrentPath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Handle hover and click events for menu
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsMenuOpen(true);
      setIsUserMenuOpen(false); // Close user menu when opening main menu
    };

    const handleUserMouseEnter = () => {
      if (isUserLoggedIn) {
        setIsUserMenuOpen(true);
        setIsMenuOpen(false); // Close main menu when opening user menu
      }
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
        setIsSettingsExpanded(false);
      }
    };

    const menuButton = menuButtonRef.current;
    const userButton = userButtonRef.current;

    if (menuButton) {
      menuButton.addEventListener("mouseenter", handleMouseEnter);
    }

    if (userButton && isUserLoggedIn) {
      userButton.addEventListener("mouseenter", handleUserMouseEnter);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("mouseenter", handleMouseEnter);
      }
      if (userButton && isUserLoggedIn) {
        userButton.removeEventListener("mouseenter", handleUserMouseEnter);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserLoggedIn]);

  // Handle click outside for modals
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLogoutModalOpen || isPasswordModalOpen) {
        event.stopPropagation();
      }
    };

    if (isLogoutModalOpen || isPasswordModalOpen) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isLogoutModalOpen, isPasswordModalOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  

  const handleSettingsToggle = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout(); // Use AuthProvider's logout function
    setIsUserMenuOpen(false);
    setIsLogoutModalOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleChangePassword = () => {
    setCurrentPassword("");
    setPasswordError("");
    setIsPasswordModalOpen(true);
  };

  const verifyPassword = () => {
    if (isPasswordLocked) {
      setPasswordError("Too many failed attempts. Please try again later.");
      return;
    }

    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    // Verify the password
    if (user && user.password === currentPassword) {
      // Password is correct
      setIsPasswordModalOpen(false);
      setCurrentPassword("");
      setPasswordError("");
      setPasswordAttempts(0);
      navigate("/login/change-password");
    } else {
      // Password is incorrect
      const newAttempts = passwordAttempts + 1;
      setPasswordAttempts(newAttempts);

      if (newAttempts >= 5) {
        setIsPasswordLocked(true);
        setPasswordError("Too many failed attempts. Please try again later.");
      } else {
        setPasswordError(`Invalid password. Please try again. (Attempt ${newAttempts}/5)`);
      }
    }
  };

  const cancelPasswordVerify = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setPasswordError("");
  };

  
  // Get username for display
  

  // Handle user icon click
  const handleUserIconClick = () => {
    if (isUserLoggedIn) {
      setIsUserMenuOpen(!isUserMenuOpen);
      setIsMenuOpen(false);
    } else {
      navigate("/login");
    }
  };

  // Handle restricted navigation
  const handleRestrictedNavigation = (path) => {
    if (!isUserLoggedIn) {
      navigate(path);
    } else {
      navigate(path);
    }
  };

  // Handle login button click in the popup
  const handleLoginRedirect = () => {
    setIsLoginModalOpen(false);
    navigate("/login");
  };


  return (
    <div className="w-full top-0 z-50">
      <nav className="w-full">
        <div className="relative flex items-center justify-between px-4 sm:px-8 py-2 ">
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
                const isRestricted = false; // Simplified for now
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
                );
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
                      );

                      return isRestricted ? (
                        <button
                          key={item.name}
                          className={`block w-full px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-black/50 transition-colors text-center
                            ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleRestrictedNavigation(item.path);
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
                      );
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
                      );

                      return isRestricted ? (
                        <button
                          key={item.name}
                          className={`block w-full px-3 py-2 font-['comfortaa'] text-[18px] font-bold text-white hover:bg-white/50 transition-colors text-center
                            ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleRestrictedNavigation(item.path);
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
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Button */}
            <div className="relative z-50" ref={userMenuRef}>
              {isUserLoggedIn ? (
                <button
                  ref={userButtonRef}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 text-white font-['comfortaa'] font-bold hover:bg-white/60 transition-colors"
                  onClick={handleUserIconClick}
                >
                  <span className="flex items-center justify-center w-full h-full">{getUserInitial(isUserLoggedIn,user)}</span>
                </button>
              ) : (
                <button className="text-white hover:text-gray-300 transition-colors z-50" onClick={handleUserIconClick}>
                  <User size={24} />
                </button>
              )}

              {/* User Menu Dropdown */}
              {isUserMenuOpen && isUserLoggedIn && (
                <div className="absolute right-0 top-10 w-[220px] bg-black/40 backdrop-blur-sm rounded-[10px] border border-white/10 shadow-lg z-50">
                  <div className="py-3 px-4">
                    {/* User Avatar and Name */}
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/60 text-white font-['comfortaa'] text-lg font-bold">
                        {getUserInitial(isUserLoggedIn,user)}
                      </div>
                      <div className="text-white font-['comfortaa'] font-bold text-center">Hello {getUsername(isUserLoggedIn,user)}</div>
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
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 hidden sm:block"
            >
              <X size={20} />
            </button>
            <h3 className="text-white font-['comfortaa'] text-xl font-bold mb-4 text-center">Hey there!</h3>
            <p className="text-white font-['comfortaa'] text-center mb-6">
              Log in to unlock this feature and explore more cool stuff!
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleLoginRedirect}
                className="px-6 py-2 bg-white/50 hover:bg-white/60 text-white font-['comfortaa'] font-bold rounded-full animate-pulse"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;