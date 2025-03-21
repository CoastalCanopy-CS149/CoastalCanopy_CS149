import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import background from "/imgs/community_reporting/bg1.jpg"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import {ArrowUp} from "lucide-react"

export default function CommunityReporting1() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  })
  const [image, setImage] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const userAgent = navigator.userAgent
    const mobileOrTabletRegex = /Mobi|Android|iPhone|iPad|iPod/i
    setIsMobileOrTablet(mobileOrTabletRegex.test(userAgent))

    // Check if we have preserved form data and image from navigation
    if (location.state) {
      if (location.state.formData) {
        setFormData(location.state.formData)
      }
      if (location.state.image) {
        setImage(location.state.image)
      }
    }
  }, [location.state])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    const { firstName, lastName, email, contactNumber } = formData;
    if (!firstName || !lastName || !email || !contactNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    navigate("../report-anonymous", {
      state: {
        formData,
        image,
        isAnonymous: false,
        fromIdentityPage: true,
      },
    })
  }

  return (
    <div
      className="bg-cover min-h-screen bg-fixed "
      style={{ backgroundImage: `url(${background})` }}
    >
      
      <div className="z-20 relative" id="top">
        <Navbar />
      </div>

      <div className="flex justify-center items-center py-10">
        <div className="flex justify-center items-center mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen h-auto ">
          <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
            {!isMobileOrTablet && (
              <div className="bg-red-500 p-2 sm:p-3 text-center font-bold rounded">
                ⚠ Please access this application from a mobile phone or tablet
                to do a reporting
              </div>
            )}

            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6 p-4 bg-white rounded-lg"
              >
                <h1 className="text-xl sm:text-2xl font-bold text-center">Reporting Form</h1>
                <p className="text-sm text-center">
                  This information will be used for authentication purposes
                  only.
                </p>

                {["firstName", "lastName", "email", "contactNumber"].map(
                  (field) => (
                    <div key={field}>
                      <label
                        htmlFor={field}
                        className="block text-md font-medium p-2 sm:p-3"
                      >
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        id={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md p-3 sm:p-2 border border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 "
                        placeholder={
                          field === "contactNumber" ? "+94 XX XXX XXXX" : ""
                        }
                        required
                        // disabled={!isMobileOrTablet}
                      />
                    </div>
                  )
                )}

                <button
                  type="submit"
                  className=" bg-blue-600 hover:bg-blue-700  font-semibold py-2 px-4 rounded-lg transition duration-200"
                  // disabled={!isMobileOrTablet}
                >
                  Continue
                </button>
              </form>
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
  );
}

