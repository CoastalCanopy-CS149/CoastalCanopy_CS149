import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import bg from "/imgs/gamification/bg1.jpg";
import { motion } from "framer-motion"
import { ArrowUpRight, Share2, Coins, ArrowUp} from 'lucide-react';
import Progress from "./progress";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
// import { useAuth } from "../../context/AuthContext";



export default function GamificationMain() {
    const navigate = useNavigate();
    const [showProgress, setShowProgress] = useState(true);

    // Declare profileDetails with useState and initialize it to an empty object
    const [profileDetails, setProfileDetails] = useState({
      points: 0,
      treesPlanted: 0,
      progress: 0,
      avatar: "/imgs/gamification/default.png",
    });
    // const {user} = useAuth();
    const username = "Tharushi"
    //const username = user?.user.username || "Tharushi";
    useEffect(() => {
      // Send POST request to backend with the username
      axios
        .post("https://coastalcanopy.up.railway.app/gamification/getDetails", { username: username })
        .then((response) => {
          console.log(response.data); // Log the response to check data structure
          setProfileDetails(response.data[0]); // Store user details in state (first element)
        })
        .catch((error) => console.error("Error fetching profile details:", error));
    }, []);
  
    // Destructuring the profile details for easy access
    const points = profileDetails.points || 0;
    const treesPlanted = profileDetails.treesPlanted || 0;
    const progress = profileDetails.progress || 0; // Assuming this might be part of the backend later
    const profileImage = profileDetails.avatar || "/imgs/gamification/default.png";

    const navigateLeaderboard = () => {
      navigate("../leaderboard")
    }

    const rollAnimation = {
      animate: {
        rotateY: [0, 360],
        transition: {
          duration: 3,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        },
      }
    }
      
    return(
      <div >
      <div
        className={"bg-cover min-h-screen bg-fixed"}
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="relative z-20" id="top">
          <Navbar />
        </div>

        
        <div className="flex justify-center items-center">
          <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen h-auto flex justify-center">
          
          <div className="relative flex h-full flex-col items-center justify-start pt-8">
            {/* Top pills */}
            <div className="mb-20 sm:mb-15 flex w-full max-w-md justify-between px-3 sm:px-2 gap-4 text-center">
              <div className="flex justify-center items-center rounded-2xl bg-green-500/80 border-2 border-green-600 px-2 sm:px-4 py-1 sm:py-2 text-white shadow-lg hover:scale-105 transition-transform">
                <span className="font-medium">{username}</span>
              </div>
              <div className="flex justify-center items-center rounded-2xl bg-green-500/80 border-2 border-green-600 px-2 sm:px-4 py-1 sm:py-2 text-white shadow-lg hover:scale-105 transition-transform">
                <button onClick={() => setShowProgress(true)}>
                  <Coins className="inline-block mr-2 text-yellow-300" />
                  <span className="font-medium">Points: {points}</span>
                </button>
              </div>
            </div>
    
            {/* Profile picture */}
            <motion.dev 
            className="relative mb-20 h-24 w-24 overflow-hidden rounded-full border-4 border-green-400 bg-green-300" 
            variants={rollAnimation}
            animate="animate"
            style={{ transformStyle: "preserve-3d" }}>

              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />

            </motion.dev>
    
            {/* Stats card */}
            <div className="w-full max-w-md rounded-lg bg-green-500/80 border-2 border-green-600 shadow-lime-600 p-6 text-white">
              <div className="mb-6 grid grid-cols-2 gap-4">   
                <div>
                  <h3 className="text-lg font-medium">No. of Trees Planted</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-medium">{treesPlanted}</span>
                </div>
    
                <div>
                  <h3 className="text-lg font-medium">Current Tree's Progress</h3>
                </div>
                <div className="text-right">
                  <div className="relative ml-auto h-8 w-8">
                    <svg className="h-8 w-8" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#444"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="3"
                        strokeDasharray={`${progress}, 100`}
                      />
                      <text x="18" y="20.5" textAnchor="middle" fontSize="10" fill="white">
                        {progress}%
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
    
              <div className="flex items-center justify-between mt-16">
              <Link 
                to="../leaderboard" 
                className="text-zinc-950/60 hover:text-black inline-flex items-center gap-1"
              >
                Leaderboard
                <ArrowUpRight className="inline-block" />
              </Link>
              </div>
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
        </div>
        {showProgress && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative z-30 ">
              <Progress points={points} username={username} />
              <button
                className="absolute top-4 m-8 right-4 rounded-full py-2 px-3 text-green-600 hover:text-red-600"
                onClick={() => setShowProgress(false)}
              >
                X
              </button>
            </div>
          </div>
        )}
        <Footer className="z-20" />
      </div> 
      </div>
    )
}