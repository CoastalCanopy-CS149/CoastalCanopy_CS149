import { Link } from "react-router-dom"
import background from "/imgs/community_reporting/BgComRep.jpg"

export default function CommunityReportingMain() {
  return (
    <div
      className="bg-cover min-h-screen flex justify-center items-center bg-fixed py-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="z-10 bg-gray-50 bg-opacity-10 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto flex justify-center items-center">
        <div className="max-w-2xl w-full text-center ">
          <h1 className="text-4xl font-bold mb-6 ">Reporting Form</h1>
          <p className="text-lg mb-8 text-gray-900 font-bold">
            Choose whether to report anonymously to protect your identity or with information.
          </p>
          <div className="space-y-4">
            <Link
              to="report-anonymous"
              state={{ isAnonymous: true }}
              className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-full p-6 text-lg transition-colors duration-200"
            >
              Report Anonymously
            </Link>
            <Link
              to="report-identity"
              state={{ isAnonymous: false }}
              className="block w-full bg-green-600 hover:bg-green-700 text-white rounded-full p-6 text-lg transition-colors duration-200"
            >
              Report With Identity
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

