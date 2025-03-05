import { useState } from "react"
import { motion } from "framer-motion"
import bg from "/imgs/gamification/gamificationBg1.jpg"


export default function GamificationLeaderboard() {
  // Sample data for top 7 users
  const [users] = useState([
    {
      id: 1,
      username: "EcoWarrior",
      points: 450,
      avatar: "/imgs/gamification/user1.png?height=60&width=60",
      color: "bg-amber-400",
    },
    {
      id: 2,
      username: "Greeny_Granny",
      points: 340,
      avatar: "/imgs/gamification/user3.png?height=60&width=60",
      color: "bg-sky-400",
    },
    {
      id: 3,
      username: "NatureFriend",
      points: 320,
      avatar: "/imgs/gamification/user7.png?height=60&width=60",
      color: "bg-green-400",
    },
    {
      id: 4,
      username: "Greeny_Granny",
      points: 340,
      avatar: "/imgs/gamification/user4.png?height=60&width=60",
      color: "bg-sky-500",
    },
    {
      id: 5,
      username: "Eco_Girl",
      points: 310,
      avatar: "/imgs/gamification/user5.png?height=60&width=60",
      color: "bg-pink-400",
    },
    {
      id: 6,
      username: "CoastBuster3000",
      points: 300,
      avatar: "/imgs/gamification/user6.png?height=60&width=60",
      color: "bg-purple-500",
    },
    {
      id: 7,
      username: "Eco_Avenger",
      points: 270,
      avatar: "/imgs/gamification/user8.png?height=60&width=60",
      color: "bg-yellow-400",
    },
  ])

  // Get top 3 users for the podium
  const topThree = users.slice(0, 3)

  // Get users ranked 4-7
  const otherUsers = users.slice(3, 7)

  // Animation variants for the rolling effect
  const rollAnimation = {
    animate: {
      rotateY: [0, 360],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      },
    },
  }

  return (
    <div
      className="bg-cover min-h-screen flex justify-center items-center bg-fixed py-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="z-10 bg-gray-50 bg-opacity-15 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto flex justify-center">
        <div className="w-full max-w-3xl mx-auto p-6 rounded-xl text-white min-h-[600px] flex flex-col">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="inline-block px-8 py-2 text-3xl font-medium">Leader Board</h1>
          </div>

          {/* Podium Section */}
          <div className="flex justify-center items-end h-[300px]">
            <div className="flex items-end gap-20 h-full">
              {/* 2nd Place */}
              <div className="flex flex-col items-center relative">
                <div className="relative z-10 mb-[-15px] perspective-[1000px]">
                  <motion.div
                    className="w-[60px] h-[60px] rounded-full border-3 border-white overflow-hidden"
                    variants={rollAnimation}
                    animate="animate"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={topThree[1]?.avatar || "/placeholder.svg?height=60&width=60"}
                      alt={`${topThree[1]?.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="w-[80px] h-[180px] bg-green-500 rounded-t-lg"></div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center relative">
                <div className="relative z-10 mb-[-15px] perspective-[1000px]">
                  <motion.div
                    className="w-[60px] h-[60px] rounded-full border-3 border-white overflow-hidden"
                    variants={rollAnimation}
                    animate="animate"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <img
                      src={topThree[0]?.avatar || "/placeholder.svg?height=60&width=60"}
                      alt={`${topThree[0]?.username}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
                <div className="w-[80px] h-[240px] bg-green-500 border-2 border-amber-300 rounded-t-lg"></div>
              </div>

                {/* 3rd Place */}
                

            </div>
          </div>

            {/* Other Ranks */}
        </div>
      </div>
    </div>
  )
}