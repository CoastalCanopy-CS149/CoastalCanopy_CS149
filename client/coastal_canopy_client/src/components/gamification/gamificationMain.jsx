import { Link, useNavigate } from "react-router-dom";
import bg from "/imgs/gamification/gamificationBg1.jpg";
import { motion } from "framer-motion"
import { ArrowUpRight, Share2 } from 'lucide-react';


export default function GamificationMain() {
    const navigate = useNavigate();

    const username = "Greeny_Granny's Lagoon"
    const points = 340
    const rank = "004"
    const treesPlanted = 10
    const progress = 80
    const profileImage = "/imgs/gamification/user4.png"

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
        <div
        className="bg-cover min-h-screen flex justify-center items-center bg-fixed py-10"
        style={{ backgroundImage: `url(${bg})` }}
      >
        
        <div className="z-10 bg-gray-50 bg-opacity-25 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto flex justify-center">
        
  
        <div className="relative z-10 flex h-full flex-col items-center justify-start pt-8">
          {/* Top pills */}
          <div className="mb-20 flex w-full max-w-md justify-between px-4">
            <div className="rounded-full bg-green-500/80 border-2 border-green-600 px-4 py-2  text-white shadow-lg">
              <span className="font-medium">{username}</span>
            </div>
            <div className="rounded-full bg-green-500/80 border-2 border-green-600 px-4 py-2 text-white shadow-lg">
              <span className="font-medium">Points: {points}</span>
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
                <h3 className="text-lg font-medium">Rank</h3>
              </div>
              <div className="text-right">
                <span className="text-lg font-medium">#{rank}</span>
              </div>
  
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
  
              <button className="text-zinc-950/60 hover:text-black">
                <Share2 />
              </button>
            </div>
          </div>
        </div>
      
        </div>
        </div>
    )
}