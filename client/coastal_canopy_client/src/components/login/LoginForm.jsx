"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { signInWithGoogle } from "./firebaseConfig"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import axios from "axios";
import { siteConfig } from "../../constant/siteConfig";
import { useAuth } from "../../context/AuthContext";

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import { useAppContext } from "../../context/AppContext"

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  
  const {login} = useAuth();
  const {addSuccess, addError} = useAppContext();



  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    setInvalidCredentials(false)

   

    // Basic validation
    if (!email) newErrors.email = "Email is required"
    if (!password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    loginUser();
    
  }
  const loginUser = async () => {
    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/login`,
        {
          email: email,
          password: password,
          remember: rememberMe
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setIsLoading(false);
        
        console.log(response);
        addSuccess(response.data.message);
        localStorage.removeItem("otpTimeLeft");
        localStorage.removeItem("otpResendCount");
        localStorage.removeItem("otpIsResendLocked");
        localStorage.removeItem("otpLockTimeLeft");
        
        login(response.data.data);

        navigate("/");
      }
    } catch (error) {
      alert(error.response.data.message);
      addError(error.response.data.message);
      console.log(error);
      setIsLoading(false);
    }
  };


  const handleSocialLogin = async (platform) => {
    if (platform === "google") {
      try {
        const user = await signInWithGoogle()

        login(user.data)
        
        
      } catch (error) {
        console.error("Google Sign-In Failed:", error.message)
      }
    }
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
                    Account locked. Try again in {}
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

      <Footer />
    </div>
  )
}

export default Login

