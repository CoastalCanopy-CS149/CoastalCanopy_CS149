import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TreePalm, Sun, CloudRain, Cloud, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import bg from "/imgs/gamification/bg1.jpg";

export default function PlantMangrove() {
  const [step, setStep] = useState(1); // Tracks the current step in the planting process
  const [isPlanted, setIsPlanted] = useState(false); // Tracks if the mangrove has been planted
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
      const timer = setTimeout(() => setStep(0),setIsPlanted(true), 2000); // Final step after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div
      className={"bg-cover min-h-screen flex justify-center items-center bg-fixed py-10" }
      style={{ backgroundImage: `url(${bg})` }}
    >
            
      <div className="bg-gray-50 bg-opacity-15 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto flex justify-center items-center">
      {/* Confetti celebration when the mangrove is planted */}
      {isPlanted && <Confetti width={width} height={height} recycle={false} />}

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
              <TreePalm className="text-white" size={40} />
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
            <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="text-white" size={40} />
            </div>
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

      {/* Clouds for a playful touch */}
      <div className="absolute top-10 left-10 animate-float">
        <Cloud className="text-gray-300" size={60} />
      </div>
      <div className="absolute top-20 right-20 animate-float-delay">
        <Cloud className="text-gray-300" size={80} />
      </div>
    </div>
    </div>
  );
}