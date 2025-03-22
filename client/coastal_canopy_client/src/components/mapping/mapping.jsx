import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Rectangle, Popup, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import L from "leaflet"; // Import Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png"; // Import marker icon
import markerIconShadow from "leaflet/dist/images/marker-shadow.png"; // Import marker shadow

// Set the default icon for Leaflet markers
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define the type for mangrove locations
const initialBounds = [
  [7.0, 79.8], // Southwest corner
  [7.3, 80.0], // Northeast corner
]

function Mapping() {
  const [mangroveLocations, setMangroveLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMangroveLocations = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://coastalcanopy.up.railway.app/api/mapping/mangrove-locations")

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setMangroveLocations(data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching mangrove locations:", err)
        setError("Failed to load mangrove locations. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchMangroveLocations()
  }, [])

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/imgs/mapping/background.jpg')" }}
    >
      <div className="relative z-20">
        <Navbar />
      </div>

      <div className="flex-grow flex items-center justify-center">
        {/* Centered Blur Background */}
        <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-4">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Negombo Lagoon Mangrove Ecosystems
          </h1>

          {/* Map Component */}
          <div className="w-full h-[500px] sm:h-[600px] md:h-[700px] rounded-2xl overflow-hidden bg-white p-4">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
                <p className="text-xl text-gray-600">Loading mangrove data...</p>
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl">
                <p className="text-xl text-red-600">{error}</p>
              </div>
            ) : (
              <MapContainer
                bounds={
                  mangroveLocations.length > 0
                    ? mangroveLocations.flatMap((location) => location.bounds)
                    : initialBounds
                }
                zoom={14}
                minZoom={7}
                className="w-full h-full rounded-2xl"
                maxBounds={[
                  [5.85, 79.65],
                  [9.85, 81.9],
                ]}
                maxBoundsViscosity={1.0}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {mangroveLocations.map((location) => (
                  <div key={location.id}>
                    <Rectangle bounds={location.bounds} color="green" fillColor="green" fillOpacity={0.6}>
                      <Popup>{location.name}</Popup>
                    </Rectangle>
                    <Marker position={location.labelPos}>
                      <Popup>{location.name}</Popup>
                    </Marker>
                  </div>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Mapping

