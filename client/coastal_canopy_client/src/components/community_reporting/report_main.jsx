import { Link } from "react-router-dom"
import background from "/imgs/community_reporting/bg1.jpg"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import {ArrowUp} from "lucide-react"

export default function CommunityReportingMain() {
  return (
    <div
      className="bg-cover min-h-screen bg-fixed "
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="z-20 relative" id="top">
        <Navbar />
      </div>

      <div className="flex justify-center items-center">
        <div className=" mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl min-h-screen p-4 lg:px-20 sm:px-10 h-auto flex justify-center">
          <div className="w-full text-center">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Reporting Form
            </h1>
            <p className="text-lg mt-6 sm:mt-8 md:mt-10 text-white font-bold">
              See mangrove destruction?
            </p>
            <p className="text-lg mb-5 sm:mb-6 md:mb-8 mt-6 sm:mt-8 md:mt-10 text-white">
              Capture a photo, 
              share the location, and report it. You can choose to stay anonymous. 
              Our system will verify the report and alert authorities to take action. 
              Every report makes a difference!
            </p>
            <p className="text-lg mb-5 sm:mb-6 md:mb-8 text-white font-bold">
              Choose whether to report anonymously to protect your identity or
              with information.
            </p>
            <div className="w-full flex justify-center items-center">  
              <div className="w-full sm:w-5/6 md:w-4/5 lg:w-3/4 mt-8 sm:mt-10 md:mt-12 space-y-4 sm:space-y-6 md:space-y-8 ">
                <Link
                  to="report-identity"
                  state={{ isAnonymous: false }}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-3xl p-4 sm:p-4 md:p-5 lg:p-6 text-lg sm:text-xl md:text-2xl transition-colors duration-200 "
                >
                  Report With Identity
                </Link>

                <Link
                  to="report-anonymous"
                  state={{ isAnonymous: true }}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-3xl p-4 sm:p-4 md:p-5 lg:p-6 text-lg sm:text-xl md:text-2xl transition-colors duration-200"
                >
                  Report Anonymously
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="z-20 fixed bottom-8 right-8">
          <a 
            href="#top" 
            className="flex items-center justify-center w-12 h-12 bg-green-600/95 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
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

