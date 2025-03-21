import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import bg from "/imgs/gamification/bg1.jpg"
import axios from "axios"
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

export default function GamificationLeaderboard() {

  const [leaderboard, setLeaderboard] = useState([]);

  const colors = [
    "bg-red-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-yellow-500",
  ]

  let index = 0;

  useEffect(() => {
    axios.get("https://coastalcanopy.up.railway.app/gamification/getRanks")
      .then((response) => setLeaderboard(response.data.leaderboard))
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, [])

  // Get top 3 users for the podium
  const topThree = leaderboard.slice(0, 3)

  // Get users ranked 4-7
  const otherUsers = leaderboard.slice(3, 7)

  // Animation variants for the rolling and floating effects
  const rollAnimation = {
    initial: { rotateY: 0 },
    animate: {
      rotateY: [0, 360],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }



  return (
    <div
      className="bg-cover min-h-screen  bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="relative z-20">
        <Navbar />
      </div>

      <div className="flex justify-center items-center">
      <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen h-auto flex justify-center">
        <div className="w-full max-w-3xl mx-auto p-6 rounded-xl min-h-[600px] flex flex-col">
          {/* Title with Trophy */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-center mb-8 flex justify-center items-center"
          >
            <Trophy className="mr-4 text-green-400" size={48} strokeWidth={2} />
            <h1
              className="inline-block px-8 py-2 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-white"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Leader Board
            </h1>
          </motion.div>

          {/* Podium Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-end h-[300px]"
          >
            <div className="flex items-end gap-20 h-full">
              {/* 2nd Place */}
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="flex flex-col items-center relative"
              >
                <div className="relative z-10 mb-[-15px] perspective-[1000px]">
                  <motion.div
                    className="w-[60px] h-[60px] rounded-full border-3 border-white overflow-hidden shadow-lg"
                    variants={rollAnimation}
                    animate="animate"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={
                        topThree[1]?.avatar ||
                        "/placeholder.svg?height=60&width=60"
                      }
                      alt={`${topThree[1]?.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="w-[80px] h-[180px] bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg shadow-md"></div>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="flex flex-col items-center relative"
              >
                <div className="relative z-10 mb-[-15px] perspective-[1000px]">
                  <motion.div
                    className="w-[60px] h-[60px] rounded-full border-3 border-white overflow-hidden shadow-lg"
                    variants={rollAnimation}
                    animate="animate"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={
                        topThree[0]?.avatar ||
                        "/placeholder.svg?height=60&width=60"
                      }
                      alt={`${topThree[0]?.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="w-[80px] h-[240px] bg-gradient-to-t from-amber-500 to-yellow-400 border-2 border-white rounded-t-lg shadow-xl"></div>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                variants={floatAnimation}
                animate="animate"
                className="flex flex-col items-center relative"
              >
                <div className="relative z-10 mb-[-15px] perspective-[1000px]">
                  <motion.div
                    className="w-[60px] h-[60px] rounded-full border-3 border-white overflow-hidden shadow-lg"
                    variants={rollAnimation}
                    animate="animate"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={
                        topThree[2]?.avatar ||
                        "/placeholder.svg?height=60&width=60"
                      }
                      alt={`${topThree[2]?.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="w-[80px] h-[140px] bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg shadow-md"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Other Ranks */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-lg"
          >
            {otherUsers.map((user, index) => (
              <motion.div
                key={user.rank}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 transition-transform"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg font-bold text-lg text-white">
                  {user.rank}
                </div>
                <div
                  className={`flex-1 flex items-center p-3 rounded-full overflow-hidden ${colors[index % colors.length]} bg-opacity-80`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 shadow-md">
                    <img
                      src={user.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={`${user.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base text-white">
                      {user.username}
                    </div>
                    <div className="text-sm text-white text-opacity-80">
                      {user.points} points
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}
