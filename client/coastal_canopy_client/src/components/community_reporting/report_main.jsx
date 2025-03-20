import { Link } from "react-router-dom"
import background from "/imgs/community_reporting/BgComRep.jpg"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import {ArrowUp} from "lucide-react"

export default function CommunityReportingMain() {
  return (
    <div
      className="bg-cover min-h-screen bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="z-20 relative" id="top">
        <Navbar />
      </div>
      
      <div className="flex justify-center items-center py-10">
        <div className="z-10 bg-gray-50 bg-opacity-10 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto flex justify-center items-center">
          <div className="max-w-2xl w-full text-center ">
            <h1 className="text-3xl font-bold mb-6 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Reporting Form</h1>
            <p className="text-lg mb-8 text-white font-bold">
              Choose whether to report anonymously to protect your identity or with information.
            </p>
            <div className="space-y-4">
              <Link
                to="report-identity"
                state={{ isAnonymous: false }}
                className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-full p-6 text-lg transition-colors duration-200"
              >
                Report With Identity
              </Link>

              <Link
                to="report-anonymous"
                state={{ isAnonymous: true }}
                className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-full p-6 text-lg transition-colors duration-200"
              >
                Report Anonymously
              </Link>
            </div>
          </div>
        </div>
        
        <div className="z-20 fixed bottom-8 right-8">
          <a 
            href="#top" 
            className="flex items-center justify-center w-12 h-12 bg-green-600/90 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </a>
        </div>
          
      </div>
      <Footer />  
    </div>
  )
}

