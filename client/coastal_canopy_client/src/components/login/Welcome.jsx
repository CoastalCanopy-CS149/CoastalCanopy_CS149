import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/adamina"

const Welcome = () => {
  const navigate = useNavigate()

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
            <h1 className="font-['Aclonica'] text-[#BDBDBD] text-[42px] text-center mb-4">Nature's Ally Awaits You</h1>
            <p className="font-['Adamina'] text-[#BDBDBD] text-[32px] text-center mb-12">Login. Protect. Preserve</p>

            <button
              onClick={() => navigate("./login")}
              className="w-[539px] h-[82px] rounded-[50px] bg-white/30 text-white font-['comfortaa'] text-[36px] font-bold hover:bg-white/40 transition-colors shadow-lg mb-8"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("./signup")}
              className="text-white font-['comfortaa'] text-[32px] underline hover:text-gray-200"
            >
              Create an account
            </button>

            <div className="absolute bottom-32 left-0 right-0 flex justify-between px-8">
              <button
                onClick={() => navigate("../..")}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path
                    d="M15 18l-6-6 6-6"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigate("./login")}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Welcome

