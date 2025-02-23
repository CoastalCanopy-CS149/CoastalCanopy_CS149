"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Facebook, Apple, User, Lock } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!username) newErrors.username = "Username is required"
    if (!password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (rememberMe) {
      localStorage.setItem("username", username)
      localStorage.setItem("rememberMe", "true")
    } else {
      localStorage.removeItem("username")
      localStorage.removeItem("rememberMe")
    }

    // Handle login logic here
    console.log("Login submitted:", { username, password, rememberMe })
  }

  const handleSocialLogin = (platform) => {
    switch (platform) {
      case "facebook":
        window.location.href = "https://facebook.com/login"
        break
      case "google":
        window.location.href = "https://accounts.google.com"
        break
      case "apple":
        window.location.href = "https://appleid.apple.com"
        break
    }
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
            <h1 className="font-['Aclonica'] text-[#BDBDBD] text-[40px] text-center mb-2">Welcome Back</h1>
            <p className="font-['comfortaa'] text-white text-[16px] text-center mb-8">Login to your account</p>

            <form onSubmit={handleSubmit} className="space-y-6 w-[535px]">
              <div className="relative">
                <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white" size={24} />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-[75px] pl-16 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[22px]"
                />
                {errors.username && <p className="text-red-500 mt-1 ml-4 text-sm">{errors.username}</p>}
              </div>

              <div className="relative">
                <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white" size={24} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[75px] pl-16 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[22px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white"
                >
                  {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
                {errors.password && <p className="text-red-500 mt-1 ml-4 text-sm">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-white font-['comfortaa'] text-[18px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                      ${rememberMe ? "bg-white" : ""}`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="none" stroke="currentColor">
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
                <Link to="/forgot-password" className="hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-[539px] h-[82px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[32px] hover:bg-white/60 transition-colors shadow-lg"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-white font-['comfortaa'] text-[18px]">
              <p className="mb-4">Or</p>
              <div className="flex justify-center gap-8 mb-6">
                <button
                  onClick={() => handleSocialLogin("facebook")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <Facebook size={24} className="text-white" />
                </button>
                <button
                  onClick={() => handleSocialLogin("google")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                <button
                  onClick={() => handleSocialLogin("apple")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                >
                  <Apple size={24} className="text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <p>Don't have an account?</p>
                <Link to="/signup" className="underline hover:text-gray-200">
                  Sign Up
                </Link>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="absolute left-8 bottom-8 w-10 h-10 rounded-full bg-white flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-white flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M9 18l6-6-6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Login

