import { useState } from "react";
import { ChevronRight } from "lucide-react";
import AimMissionVision from "./aim_mission_vision"; // Import component

function home() {
  const [showAimMissionVision, setShowAimMissionVision] = useState(false); // State to toggle view

  // Handle button click
  const handleLearnMoreClick = () => {
    setShowAimMissionVision(true); // Show AimMissionVision component
  };

  // If the user clicked "Learn More", show the aim_mission_vision component
  if (showAimMissionVision) {
    return <AimMissionVision />;
  }

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/imgs/home/background_home.jpg')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Blurred Left Section */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-inherit/40 backdrop-blur-md" />

      {/* Content Section */}
      <div className="relative z-10 flex flex-col px-8 md:px-16 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Blurred Beginnings, <span className="text-yellow-400">Clearer Futures</span>
        </h1>

        <p className="text-white text-lg mb-6">
          Every Mangrove tells a story - some hidden, some fading. Together we uncover their secrets.
          Join the journey to clarity and ensure a sustainable future for our ecosystems.
        </p>
        
        <button 
          className="bg-gray-300 px-6 py-2 w-3/4 text-gray-900 rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-gray-400" 
          onClick={handleLearnMoreClick}
        >
          Learn More <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default home;