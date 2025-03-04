import { useState } from "react";
import { ChevronRight } from "lucide-react";
import AimMissionVision from "../aim/aim"; 
import { Link } from "react-router-dom";
import HomeNavbar from "../home/homeNavbar";


function Home() {


  return (
    <div className="relative min-h-screen flex flex-col">
      <HomeNavbar />

      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/imgs/home/background_home.jpg')` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Blurred Left Section */}
      <div className="absolute inset-y-0 left-0 display sm:w-full sm:w-3/4 lg:w-1/2 bg-inherit/40 backdrop-blur-md z-0 " />

      <div className="relative z-10 flex flex-col px-4 sm:px-8 md:px-16 w-full md:max-w-xl lg:max-w-lg justify-start items-start mt-16 sm:mt-24 md:mt-32 flex-grow">
        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Blurred Beginnings,{" "}
          <span className="text-yellow-400">Clearer Futures</span>
        </h1>

        <p className="text-white text-base sm:text-lg mb-6">
          Every Mangrove tells a story - some hidden, some fading. Together we
          uncover their secrets. Join the journey to clarity and ensure a
          sustainable future for our ecosystems.
        </p>

        <Link
          to="/aim"
          className="bg-gray-300 w-full sm:w-2/3 text-gray-900 px-4 sm:px-6 py-2 rounded-full text-base sm:text-lg font-semibold flex items-center justify-center sm:justify-start gap-2 hover:bg-gray-400"
        >
          Learn More <ChevronRight size={20} />
        </Link>
      </div>
    </div>
  );
}

export default Home;
