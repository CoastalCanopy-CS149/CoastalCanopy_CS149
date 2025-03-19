import { ChevronRight } from "lucide-react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

function AR() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main
        className="relative flex flex-col items-center justify-center flex-grow w-full bg-cover bg-center py-16"
        style={{ backgroundImage: "url('/imgs/AR/background_ar.jpg')" }}
      >
        {/* Centered Blur Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl h-4/5 bg-white/20 backdrop-blur-sm rounded-3xl" />

        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="text-center max-w-3xl relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl text-white font-bold mb-8 font-[poppins]">
            Explore Mangroves in AR
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            "Experience mangrove ecosystems like never before! Explore live
            data, species, and more."
          </p>
          <button className="px-12 py-4 text-xl bg-gradient-to-r from-green-600 to-green-300 text-slate-600 rounded-full hover:from-green-600 hover:to-green-500 transition-all duration-300 shadow-lg font-mono">
            AR Activation
          </button>
          <br />
          <br />
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            "To be implemented in future...."
          </p>
        </div>

        {/* Decorative Leaf */}
        <img
          src="/monstera-leaf.png"
          alt=""
          className="absolute bottom-0 right-0 w-48 md:w-64 opacity-80"
          aria-hidden="true"
        />

        {/* Navigation Arrow */}
        <button className="absolute right-4 bottom-24 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-colors duration-200">
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AR;
