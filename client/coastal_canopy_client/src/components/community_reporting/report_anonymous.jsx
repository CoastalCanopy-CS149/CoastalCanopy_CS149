import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import background from "/imgs/community_reporting/BgComRep.jpg"

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

  useEffect(() => {
    const userAgent = navigator.userAgent
    const mobileOrTabletRegex = /Mobi|Android|iPhone|iPad|iPod/i
    setIsMobileOrTablet(mobileOrTabletRegex.test(userAgent))
  }, [])

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

  const handleSubmit = async () => {
    const { isAnonymous, formData: previousFormData } = location.state || {}
    const completeFormData = {
      ...previousFormData,
      ...formData,
      image,
      isAnonymous,
    }

    if (isAnonymous) {
      completeFormData.firstName = null
      completeFormData.lastName = null
      completeFormData.email = null
      completeFormData.contactNumber = null
    }

    try {
      const response = await fetch("/api/submit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeFormData),
      })

      if (response.ok) {
        alert("Thank you for reporting!")
        navigate("/")
      } else {
        throw new Error("Failed to submit report")
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit report. Please try again.")
    }
  }

  return (
    <div
      className="bg-cover min-h-screen flex justify-center items-center bg-fixed py-10"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex justify-center items-center bg-gray-50 bg-opacity-10 backdrop-blur-sm p-10 rounded-3xl w-11/12 max-w-7xl min-h-screen h-auto">
        <div className="w-6/12">
          {!isMobileOrTablet && (
            <div className="bg-red-500  p-3 text-center font-bold rounded">
              ⚠ Please access this application from a mobile phone or tablet to do a reporting
            </div>
          )}

          <div className=" p-6 rounded-lg space-y-6 bg-white">
            <h1 className="text-2xl font-semibold ">Reporting Form (2nd Page)</h1>

            <div>
              <label className="block text-sm font-medium ">Capture a Picture of the Incident</label>
              {!image ? (
                <div>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="mt-2 rounded-md max-h-full w-full object-cover border-2"
                  />
                  
                  <button
                    onClick={startCamera}
                    className="mt-2 bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded"
                    // disabled={!isMobileOrTablet}
                  >
                    Start Camera
                  </button>
                  <button
                    onClick={captureImage}
                    className="mt-2 ml-2 bg-green-500 hover:bg-green-700  font-bold py-2 px-4 rounded"
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
              <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480" />
            </div>

            <div>
              <label htmlFor="destructionType" className="block text-sm font-medium ">
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

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              // disabled={!isMobileOrTablet || !image}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

