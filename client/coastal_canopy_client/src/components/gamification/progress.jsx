import { useState, useEffect } from 'react'
import { Coins} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Progress() {

    const img = [
    "/imgs/gamification/img1.png",
    "/imgs/gamification/img2.png",
    "/imgs/gamification/img3.png",
    "/imgs/gamification/img4.png",
    ]

    const [randomIndex, setRandomIndex] = useState(0)
    const[text, setText] = useState("")
    const [percentage, setPercentage] = useState(0)
    const[points, setPoints] = useState(1000)

    useEffect(() => {
        const generateRandomIndex = () => Math.floor(Math.random() * 4);
        setRandomIndex(generateRandomIndex())
      }, [])
    
    useEffect(() => {
        const checkPoints = () => {
            if(points <= 100){
                setText("You're doing terrible, but at least you're trying 🥱")
            }

            else if(points <= 300){
                setText("We're not saying you're terrible, but even potatoes score higher than this 🙂")
            }

            else if(points <= 400){
                setText("Your grandma could probably score higher, but we're not judging 😌")
            }
            else if(points <= 600){
                setText("You've gone from 'terrible' to 'meh'! 😁");
            }
            else if(points <= 800){
                setText("Almost impressive! The key word being 'almost'🤣");
            }
            else if(points < 1000){
                setText("Your friends would be impressed if you had any 😏");
            }

            else{
                setText("MAX SCORE! With great points, comes great responsibility… now go save some more mangroves!  🥳");
            }
        }
        
        checkPoints()
    }, [points])

    useEffect(() => {
        // Calculate percentage based on points (out of 1000)
        const calculatedPercentage = Math.min(100, (points / 1000) * 100);
        setPercentage(calculatedPercentage);
    }, [points]);

    return (
        <div className="p-6 flex justify-center items-center min-h-full">
            <div className="border border-gray-200 bg-white py-10 px-10 md:px-20 rounded-lg shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
                {/* Progress Image */}
                <div className="w-40 h-40 overflow-hidden rounded-full border-4 border-green-600 shadow-md">
                    <img src={img[randomIndex]} alt="Progress" className="h-full w-full object-cover" />
                </div>
                
                {/* Points Display */}
                <div className="text-yellow-500 flex items-center text-lg">
                    <Coins className="mr-2" size={24} />
                    <span className="font-bold">{points} points</span>
                </div>
                
                {/* Motivational Text */}
                <h1 className="text-xl font-semibold text-gray-800 text-center">{text}</h1>
                
                {/* Progress Bar */}
                <div className="w-full mt-2">
                    <div className="flex justify-between mb-1 text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                        <div 
                            className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-in-out" 
                            style={{width: `${percentage}%`}}
                        ></div>
                    </div>
                </div>
                
                {/* Plant Button - only shows when points reach 1000 */}
                {points >= 1000 && (
                    <Link to="../plant" className="w-full mt-4">
                        <button 
                            className="w-full py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors font-medium"
                            onClick={() => {
                                setPoints(0);
                            }}
                        >
                            Plant a virtual mangrove 🌱
                        </button>
                    </Link>
                )}
            </div>
        </div>
    )
}