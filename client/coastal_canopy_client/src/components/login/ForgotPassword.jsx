"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail } from "lucide-react"
import axios from "axios"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import { siteConfig } from "../../constant/siteConfig"
import { useAuth } from "../../context/AuthContext"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const {newUserEmailInit} = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault()
    setError("")

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/forget-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      )

      if (response.status === 200) {
        console.log(response);
        newUserEmailInit(email);
        navigate("/login/reset-verification")
      }
      
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to send reset email. Please try again."
      )
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url('/imgs/login/Background.jpg')` }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-4 sm:p-6 mt-12 mb-12">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-2">
              Forgot your Password?
            </h1>
            <p className="font-['comfortaa'] text-white text-center mb-6 max-w-md">
              That's okay, it happens! We'll help you reset your password.
              Please enter your email address associated with your account.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-[350px] space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[50px] pl-12 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[16px] shadow-lg"
                />
              </div>

              {error && <p className="text-red-500 text-center font-['comfortaa'] text-sm">{error}</p>}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-[60%] h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[18px] hover:bg-white/60 transition-colors shadow-lg"
                >
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-white font-['acme'] max-w-lg">
              <p>
                Mangroves protect the coast, and we protect your access.
                Let's get you back to your conservation efforts!
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