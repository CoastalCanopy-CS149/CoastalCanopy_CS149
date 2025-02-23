import { useNavigate } from "react-router-dom"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

const VerificationSuccess = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen w-screen overflow-y-auto overflow-x-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/login/imgs/Background.jpg')`,
      }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="relative w-[1000px] h-[700px] bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="font-['Acme'] text-[#BDBDBD] text-4xl md:text-5xl text-center mb-8">
              Your account has been successfully verified.
            </h1>
            <p className="font-['Acme'] text-[#BDBDBD] text-4xl md:text-5xl text-center mb-12">Now you can Login</p>

            <button
              onClick={() => navigate("/login")}
              className="w-[539px] h-[82px] rounded-[50px] bg-white/50 text-white font-comfortaa text-[36px] font-bold hover:bg-white/60 transition-colors shadow-lg mb-12"
            >
              Login
            </button>

            <p className="font-['Afacad'] text-white text-2xl md:text-3xl text-center max-w-[800px]">
              Each root you nurture binds the earth closer to hope
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default VerificationSuccess

