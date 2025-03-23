import { ChevronRight } from "lucide-react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import {ArrowUp} from "lucide-react"

function AR() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/imgs/AR/background_ar.jpg')" }}
    >
      <div className="relative z-20">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center">
        {/* Centered Blur Background */}
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-4">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore Mangroves in AR
          </h1>
          <p className="text-xl md:text-xl text-white/90 mb-4 leading-relaxed">
            Experience mangrove ecosystems like never before!
          </p>
          <p className="text-xl md:text-xl text-white/90 mb-12 leading-relaxed">
            Explore live data, species, and more.
          </p>

          <div>
            {/* AR Button */}
            <button
              className="bg-gradient-to-r from-green-400 to-green-700 text-green-900 hover:from-green-500 hover:to-green-800 hover:text-white font-semibold py-2 px-8 rounded-full shadow-md transition-all duration-300 ease-in-out"
              disabled
            >
              AR Activation
            </button>

            <p className="mt-6 text-gray-300 italic">
              "To be implemented in future...."
            </p>
          </div>
        </div>
      </div>
      <div className="z-20 fixed bottom-8 right-5">
      <a 
        href="#top" 
        className="flex items-center justify-center w-12 h-12 bg-green-600/90 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </a>
    </div>
      <Footer />
    </div>
  );
}

export default AR;
