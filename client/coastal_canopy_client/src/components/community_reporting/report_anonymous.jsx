import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import {ArrowUp} from "lucide-react"
import background from "/imgs/community_reporting/bg4.jpg"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

export default function CommunityReporting2() {
  const [image, setImage] = useState(null)
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [formData, setFormData] = useState({
    location: "",
    destructionType: "illegalLogging",
    latitude: null,
    longitude: null,
  })
  const location = useLocation()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const username = "Malsha"
  const points = 100


  useEffect(() => {
    const userAgent = navigator.userAgent
    const mobileOrTabletRegex = /Mobi|Android|iPhone|iPad|iPod/i
    setIsMobileOrTablet(mobileOrTabletRegex.test(userAgent))

    // Check if we have data from the identity page or preserved state
    if (location.state) {
      if (location.state.formData) {
        setFormData((prevData) => ({
          ...prevData,
          ...location.state.formData,
        }))
      }
      if (location.state.image) {
        setImage(location.state.image)
      }
    }
  }, [location.state])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg")
      setImage(imageDataUrl)

      // Get geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }))
        },
        (error) => {
          console.error("Error getting geolocation:", error)
        },
      )

      // Stop the camera stream
      const stream = videoRef.current.srcObject
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isFormValid = () => {
    return formData.latitude !== null && formData.longitude !== null && image !== null
  }

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert("Please capture an image with location access enabled. Location data and the image are required.")
      return
    }

    alert("Form is submitting...This will take few moments")

    const { isAnonymous } = location.state || {}
    const completeFormData = {
      ...formData,
      image,
      isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
    }

    if (isAnonymous) {
      completeFormData.firstName = null
      completeFormData.lastName = null
      completeFormData.email = null
      completeFormData.contactNumber = null
    }

    try {
      const response = await fetch("https://coastalcanopy.up.railway.app/reports/submit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeFormData),
      })

      if (response.ok) {
        increasePoints(username, points)
        alert("Thank you for reporting!")
        navigate("/reporting")
      } else {
        throw new Error("Failed to submit report")
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit report. Please try again.")
    }
  }

  
  const increasePoints = async (username, points) => {
    try {
      const response = await fetch('https://coastalcanopy.up.railway.app/points/Increase_points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, points }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error increasing points:', error);
    }
  };


  return (
    <div
      className="bg-cover min-h-screen bg-fixed"
      style={{ backgroundImage: `url(${background})` }}
    >

      <div className="z-20 relative" id="top">
        <Navbar />
      </div>

      <div className="flex justify-center items-center py-10">
        <div className="flex justify-center items-center mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 min-h-screen h-auto">
          <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
            {!isMobileOrTablet && (
              <div className="bg-red-500  p-2 sm:p-3 text-center font-bold rounded">
                ⚠ Please access this application from a mobile phone or tablet
                to do a reporting
              </div>
            )}

            <div className="p-6 rounded-lg space-y-6 bg-white">
              <h1 className="text-xl sm:text-2xl font-bold ">
                Reporting Form (2nd Page)
              </h1>

              <div >
                <label className="block text-sm font-medium ">
                  <div>1. Alow the camera access <span className="text-red-600">*</span></div>
                  <div>2. Capture a Picture of the Incident <span className="text-red-600">*</span></div>
                  <div>3. Allow the location access <span className="text-red-600">*</span></div>
                </label>
                {!image ? (
                  <div>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="mt-1 sm:mt-2 rounded-md  h-full max-h-full w-full object-cover border-2"
                    />

                    <button
                      onClick={() => {
                        startCamera();
                        setIsCameraActive(true);
                      }}
                      className="mt-2 bg-green-500 hover:bg-green-700  font-bold py-2 px-4 rounded"
                      // disabled={!isMobileOrTablet}
                    >
                      Start Camera
                    </button>
                    <button
                      onClick={captureImage}
                      className="mt-2 ml-2 bg-green-500 hover:bg-green-700  font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isCameraActive}
                      // disabled={!isMobileOrTablet}
                    >
                      Capture Image
                    </button>
                  </div>
                ) : (
                  <img
                    src={image || "/imgs/community_reporting_camera.png"}
                    alt="Captured"
                    className="mt-2 rounded-md shadow-md max-h-full w-full object-cover"
                  />
                )}
                <canvas
                  ref={canvasRef}
                  style={{ display: "none" }}
                  width="800"
                  height="600"
                />
              </div>

              <div>
                <label
                  htmlFor="destructionType"
                  className="block text-sm font-medium "
                >
                  Type of Destruction
                </label>
                <select
                  id="destructionType"
                  name="destructionType"
                  value={formData.destructionType}
                  onChange={handleChange}
                  className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  // disabled={!isMobileOrTablet}
                >
                  <option value="illegalLogging">Illegal Logging</option>
                  <option value="pollution">Pollution</option>
                  <option value="weatherAnomalies">Weather Anomalies</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                {location.state && location.state.fromIdentityPage && (
                  <Link
                    to="../report-identity"
                    state={{ formData, image }}
                    className="mr-4 inline-block bg-blue-500 hover:bg-blue-600  py-2 px-4 rounded"
                  >
                    Go Back
                  </Link>
                )}
                <button
                  onClick={handleSubmit}
                  className="inline-block bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
                  // disabled={!isMobileOrTablet || !image}
                >
                  Submit
                </button>
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

      <Footer />
    </div>
  );
}

