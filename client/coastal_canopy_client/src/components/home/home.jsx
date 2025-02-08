import { useState } from "react";
import { ChevronRight } from "lucide-react";
import AimMissionVision from "./aim_mission_vision"; 

function Home() {
  const [showAimPage, setShowAimPage] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/imgs/home/background_home.jpg')` }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Blurred Left Section */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-inherit/40 backdrop-blur-md" />

      {/* Conditional Rendering */}
      {showAimPage ? (
        <AimMissionVision />
      ) : (
        <div className="relative z-10 flex flex-col px-8 md:px-16 max-w-lg">
          <h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Blurred Beginnings, <span className="text-yellow-400">Clearer Futures</span>
          </h1>

          <p className="text-white text-lg mb-6">
            Every Mangrove tells a story - some hidden, some fading. Together we uncover their secrets.
            Join the journey to clarity and ensure a sustainable future for our ecosystems.
          </p>
          
          {/* Learn More Button */}
          <button 
            className="bg-gray-300 text-gray-900 px-6 py-3 w-4/5 rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-gray-400"
            onClick={() => setShowAimPage(true)}
          >
            Learn More <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
