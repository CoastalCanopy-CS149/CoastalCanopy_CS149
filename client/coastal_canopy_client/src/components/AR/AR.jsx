import { ChevronRight } from "lucide-react";

function AR() {
  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/imgs/AR/background_ar.jpg')" }}
    >
      {/* Centered Blur Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl h-4/5 bg-white/10  backdrop-blur-sm rounded-3xl" />

      {/* Overlay for better readability
      <div className="absolute inset-0 bg-black/50"></div> */}

      <div className="text-center max-w-3xl relative z-10 px-4">
        <h1
          className="text-3xl md:text-3xl text-white font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Explore Mangroves in AR
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
          "Experience mangrove ecosystems like never before! Explore live data,
          species, and more."
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
        src="/imgs/AR/monstera-leaf.png"
        alt=""
        className="absolute bottom-0 right-0 w-48 md:w-56 opacity-80"
        aria-hidden="true"
      />

      
    </main>
  );
}

export default AR;
