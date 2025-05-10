"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/comfortaa"
import "@fontsource/acme"

const VerificationSuccess = () => {
  const navigate = useNavigate()

  // Prevent back button
  useEffect(() => {
    const preventBack = () => {
      navigate("../login")
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", preventBack)

    return () => {
      window.removeEventListener("popstate", preventBack)
    }
  }, [navigate])

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
              Welcome aboard!
              <br />
              Your account has been successfully verified.
            </h1>

            <p className="font-['Acme'] text-white text-[16px] sm:text-[22px] text-center mb-6">
              Your journey begins here
              <br />
              Everything's ready—log in and dive in!
            </p>

            <button
              onClick={handleLogin}
              className="w-[60%] max-w-[250px] h-[45px] sm:h-[45px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg mb-8"
            >
              Login
            </button>

            <p className="font-['Comfortaa'] text-white text-[14px] sm:text-[17px] text-center max-w-[600px] leading-relaxed">
              Roots anchored, future secured—just like mangroves,
              <br />
              you're now firmly part of our community!
              <br />
              <span className="font-bold">Welcome home!</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default VerificationSuccess

