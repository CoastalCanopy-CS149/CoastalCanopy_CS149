"use client"

import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/acme"

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/imgs/login/Background.jpg')`,
      }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-[25px] p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-6">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[28px] md:text-[30px] text-center mb-4">
              Nature's Ally Awaits You
            </h1>

            <p className="font-['Comfortaa'] text-white text-[14px] sm:text-[16px] md:text-[18px] text-center mb-6 leading-relaxed">
              Step into the tide, where change takes root.
              <br />
              Let the journey begin, the mangroves
              <br />
              <span className="font-bold">await you.</span>
            </p>

            <button
              onClick={() => navigate("./login")}
              className="w-[250px] sm:w-[300px] md:w-[250px] h-[40px] sm:h-[45px] rounded-[50px] bg-white/30 text-white font-['comfortaa'] text-[14px] sm:text-[16px] md:text-[18px] hover:bg-white/40 transition-colors shadow-lg mb-4"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("./signup")}
              className="w-[250px] sm:w-[300px] md:w-[250px] h-[40px] sm:h-[45px] rounded-[50px] bg-white/30 text-white font-['comfortaa'] text-[14px] sm:text-[16px] md:text-[18px] hover:bg-white/40 transition-colors shadow-lg mb-6"
            >
              Create account
            </button>

            <p className="font-['Acme'] text-white text-[12px] sm:text-[14px] md:text-[23px] text-center max-w-[700px] leading-relaxed">
              Every ripple begins with a single drop. Every forest starts with a single root.
              <br />
              Stand with nature, let the roots of change grow strong.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Welcome

