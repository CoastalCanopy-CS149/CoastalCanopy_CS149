import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, CloudRain,Trees,Volume2, VolumeX } from 'lucide-react';
import Confetti from 'react-confetti';
import Howler from 'react-howler';
import { useWindowSize } from 'react-use';
import bg from "/imgs/gamification/bg1.jpg";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

export default function PlantMangrove() {
  const [step, setStep] = useState(1); // Tracks the current step in the planting process
  const [isPlanted, setIsPlanted] = useState(false); // Tracks if the mangrove has been planted
  const [isSoundPlaying, setIsSoundPlaying] = useState(true); // Tracks if the sound is playing
  const { width, height } = useWindowSize(); // For confetti dimensions

  // Simulate the planting process with a delay
  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2000); // Move to step 2 after 2 seconds
      return () => clearTimeout(timer);
    } else if (step === 2) {
      const timer = setTimeout(() => setStep(3), 2000); // Move to step 3 after 2 seconds
      return () => clearTimeout(timer);
    } else if (step === 3) {
      const timer = setTimeout(() => {
        setIsPlanted(true);
        setStep(0);
      }, 2000); // Final step after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [step]);

  const toggleSound = () => {
    setIsSoundPlaying(!isSoundPlaying);
  };

  return (
    <div
      className={"bg-cover min-h-screen bg-fixed overflow-hidden" }
      style={{ backgroundImage: `url(${bg})` }}
    >        
        {isSoundPlaying && (
          <Howler
            src="/imgs/gamification/nature.mp3"
            playing={isSoundPlaying}
            loop={true}
          />
        )}

      <div className="relative z-20">
        <Navbar />
      </div>

      <div className="flex justify-center items-center">       
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen h-auto flex justify-center items-center">
        {/* Confetti celebration when the mangrove is planted */}
        {isPlanted && <Confetti width={width} height={height} recycle={true} />}

        <div className="absolute top-5 left-5 text-white">
          <button>
          {isSoundPlaying ? (
            <Volume2 className=" hover:text-red-500" size={26} onClick={toggleSound}  />
          ) : (
            <VolumeX className="text-red-500 hover:text-white" size={26} onClick={toggleSound} />
          )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full flex justify-center items-center text-center relative overflow-hidden h-full">
          {/* Step 1: Preparing the soil */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-yellow-500 rounded-full flex items-center justify-center">
                <Sun className="text-white" size={40} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Preparing the soil...</h1>
              <p className="text-gray-600">We're getting everything ready for your mangrove. Hold tight!</p>
            </div>
          )}

          {/* Step 2: Planting the mangrove */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                <Trees className="text-white" size={40} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Planting your mangrove...</h1>
              <p className="text-gray-600">Your mangrove is being placed in its new home. Almost there!</p>
            </div>
          )}

          {/* Step 3: Watering and finishing */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                <CloudRain className="text-white" size={40} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Watering your mangrove...</h1>
              <p className="text-gray-600">Just a little water to help it grow strong and healthy!</p>
            </div>
          )}

          {/* Final Step: Mangrove planted successfully */}
          {isPlanted && (
            <div className="space-y-6 animate-fade-in">
              <img src="/imgs/gamification/plantmang.jpg" alt="Mangrove" className="w-full h-full rounded-sm" />
              <h1 className="text-2xl font-bold text-gray-800">Mangrove Planted! 🌱</h1>
              <p className="text-gray-600">
                Congratulations! Your virtual mangrove has been planted. You're helping the planet one tree at a time!
              </p>
              <Link
                to="/gamification"
                className="inline-block mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Go Back to gamification profile
              </Link>
            </div>
          )}

          {/* Background animations */}
          <div className="absolute inset-0 pointer-events-none">
            {step === 1 && (
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-yellow-200 rounded-full opacity-30 animate-pulse"></div>
            )}
            {step === 2 && (
              <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
            )}
            {step === 3 && (
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}