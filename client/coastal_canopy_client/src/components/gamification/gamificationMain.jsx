import bg from "/imgs/gamification/gamificationBg1.jpg";

export default function gamificationMain() {
    const username = "Greeny_Granny's Lagoon"
    const points = 340
    const rank = "004"
    const treesPlanted = 10
    const progress = 80
    const profileImage = "/placeholder.svg?height=100&width=100"
      
    return(
        <div
        className="bg-cover min-h-screen flex justify-center items-center bg-fixed py-10"
        style={{ backgroundImage: `url(${bg})` }}
      >
        
        <div className="z-10 bg-gray-50 bg-opacity-25 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto flex justify-center items-center">
        
  
        <div className="relative z-10 flex h-full flex-col items-center justify-start pt-8">
          {/* Top pills */}
          <div className="mb-4 flex w-full max-w-md justify-between px-4">
            <div className="rounded-full bg-green-500/80 px-4 py-2 text-white shadow-lg">
              <span className="font-medium">{username}</span>
            </div>
            <div className="rounded-full bg-green-500/80 px-4 py-2 text-white shadow-lg">
              <span className="font-medium">Points: {points}</span>
            </div>
          </div>
  
          {/* Profile picture */}
          <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-yellow-400 bg-yellow-300">
            <img src={profileImage || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
          </div>
  
          {/* Stats card */}
          <div className="w-full max-w-md rounded-lg bg-gray-800/60 p-6 text-white backdrop-blur-sm">
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
  
            <div className="flex items-center justify-between">
              <button className="flex items-center text-sm font-medium text-white/80 hover:text-white">
                Leaderboard
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              </button>
  
              <button className="text-white/80 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      
        </div>
        </div>
    )
}