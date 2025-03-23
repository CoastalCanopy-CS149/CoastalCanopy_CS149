"use client"

import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/acme"

const ResetPasswordSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Check if coming from reset password
  const fromReset = location.state?.fromReset

  // Redirect if not coming from reset password
  useEffect(() => {
    if (!fromReset) {
      navigate("../login")
    }
  }, [fromReset, navigate])

  // Prevent back button
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href)
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", preventBack)

    return () => {
      window.removeEventListener("popstate", preventBack)
    }
  }, [])

  const handleLogin = () => {
    navigate("../login")
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
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-4 sm:p-12 mt-12 mb-12">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-['Acme'] text-white text-[24px] sm:text-[30px] text-center mb-2 sm:mb-3">
              All Set!
              <br />
              Your Password Has Been Changed.
            </h1>

            <p className="font-['Acme'] text-white text-[16px] sm:text-[22px] text-center mb-6">
              You can now log in with your new password.
              <br />
              Stay secure!
            </p>

            <button
              onClick={handleLogin}
              className="w-[60%] max-w-[250px] h-[45px] sm:h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg mb-8"
            >
              Login
            </button>

            <p className="font-['Comfortaa'] text-white text-[14px] sm:text-[17px] text-center max-w-[600px] leading-relaxed">
              Just like mangroves regrow after a storm,
              <br />
              you've refreshed your access.
              <br />
              <span className="font-bold">Welcome back!</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ResetPasswordSuccess

