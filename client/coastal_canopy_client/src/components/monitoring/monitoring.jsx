// import { useEffect, useState } from 'react'; // Import React hooks
// import { createClient } from '@supabase/supabase-js'; // Import Supabase client
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js'; // Import Chart.js components
// import { Line, Bar } from 'react-chartjs-2'; // Import Line and Bar chart components from react-chartjs-2
// import Navbar from "../navbar/navbar"; // Import Navbar component
// import Footer from "../footer/footer"; // Import Footer component
// import {ArrowUp} from "lucide-react"

// // Register ChartJS components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// // Initialize Supabase client with environment variables
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// export default function MangroveAnalysis() {
//     // State variables to store fetched data and loading/error states
//     const [currentAreas, setCurrentAreas] = useState([]);
//     const [predictedAreas, setPredictedAreas] = useState([]);
//     const [areaNames, setAreaNames] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         // Fetch data from Supabase on component mount
//         async function fetchData() {
//             try {
//                 setLoading(true); // Set loading state to true
                
//                 // Query data from the 'mangrove_analysis' table
//                 const { data, error } = await supabase
//                     .from('mangrove_analysis')
//                     .select('area, area_2015, predicted_area_2026');
                    
//                 if (error) throw error; // Throw error if query fails

//                 if (!data || data.length === 0) {
//                     // Use research data if no data is returned
//                     const dummyData = [
//                         { area: 'Western Region', area_2015: 20.7, predicted_area_2026: 21.1 },
//                         { area: 'Northern Region', area_2015: 25.05, predicted_area_2026: 25.10 },
//                         { area: 'Eastern Coast', area_2015: 23.0, predicted_area_2026: 23.2 },
//                         { area: 'Southern Region', area_2015: 11.3, predicted_area_2026: 10.5 },
//                         { area: 'Mannar', area_2015: 13.5, predicted_area_2026: 13.7 }
//                     ];
                    
//                     // Update state with research data
//                     setAreaNames(dummyData.map(item => item.area));
//                     setCurrentAreas(dummyData.map(item => item.area_2015));
//                     setPredictedAreas(dummyData.map(item => item.predicted_area_2026));
//                 } else {
//                     // Update state with fetched data
//                     setAreaNames(data.map(item => item.area));
//                     setCurrentAreas(data.map(item => item.area_2015));
//                     setPredictedAreas(data.map(item => item.predicted_area_2026));
//                 }
//             } catch (err) {
//                 console.error('Error fetching data:', err); // Log error to console
//                 setError(err.message); // Update error state
//             } finally {
//                 setLoading(false); // Set loading state to false
//             }
//         }

//         fetchData(); // Call fetchData function
//     }, []); // Empty dependency array ensures this runs only once

//     // Data for the 2015 line chart
//     const lineData2015 = {
//         labels: areaNames, // X-axis labels
//         datasets: [
//             {
//                 label: 'Mangrove Extension 2015', // Dataset label
//                 data: currentAreas, // Y-axis data
//                 borderColor: 'rgba(15, 111, 50, 0.7)', // Line color
//                 backgroundColor: 'rgba(15, 111, 50, 0.7)', // Fill color
//                 tension: 0.3, // Line tension
//             }
//         ]
//     };

//     // Data for the 2026 line chart
//     const lineData2026 = {
//         labels: areaNames,
//         datasets: [
//             {
//                 label: 'Predicted Mangrove Extension 2026',
//                 data: predictedAreas,
//                 borderColor: 'rgba(35, 75, 139, 0.7)',
//                 backgroundColor: 'rgba(35, 75, 139, 0.7)',
//                 tension: 0.3,
//             }
//         ]
//     };

//     // Data for the comparison bar chart
//     const comparisonData = {
//         labels: areaNames,
//         datasets: [
//             {
//                 label: '2015',
//                 data: currentAreas,
//                 backgroundColor: 'rgba(15, 111, 50, 0.7)', // Bar color for 2015
//             },
//             {
//                 label: '2026 (Predicted)',
//                 data: predictedAreas,
//                 backgroundColor: 'rgba(35, 75, 139, 0.7)', // Bar color for 2026
//             }
//         ]
//     };

//     // Chart options for consistent styling
//     const chartOptions = {
//         responsive: true, // Make chart responsive
//         plugins: {
//                 legend: {
//                         position: 'top', // Position legend at the top
//                         labels: {
//                                 color: 'white', // Set legend text color to white
//                         },
//                 },
//         },
//         scales: {
//                 y: {
//                         title: {
//                                 display: true,
//                                 text: 'Area (sq km)', // Y-axis title
//                                 color: 'black', // Set y-axis title color
//                         },
//                         beginAtZero: true, // Start y-axis at zero
//                         grid: {
//                                 color: 'rgba(29, 24, 24, 0.2)', // Set y-axis grid lines color
//                         },
//                         ticks: {
//                                 color: 'black', // Set y-axis tick labels color
//                         },
//                 },
//                 x: {
//                         title: {
//                                 display: true,
//                                 text: 'Location', // X-axis title
//                                 color: 'black', // Set x-axis title color
//                         },
//                         grid: {
//                                 color: 'rgba(29, 24, 24, 0.2)', // Set x-axis grid lines color
//                         },
//                         ticks: {
//                                 color: 'black', // Set x-axis tick labels color
//                         },
//                 },
//         },
//     };

//     if (loading) {
//         // Show loading spinner while data is being fetched
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//             </div>
//         );
//     }

//     if (error) {
//         // Show error message if data fetching fails
//         return (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//                 <strong className="font-bold">Error:</strong>
//                 <span className="block sm:inline"> {error}</span>
//             </div>
//         );
//     }

//     // Render the main content
//     return (
//         <div
//                 className="bg-cover min-h-screen bg-fixed"
//                 style={{ backgroundImage: "url('/imgs/monitoring/background2.jpg')" }} // Background image
//         >
//                 <div className="relative z-20">
//                         <Navbar /> {/* Navbar component */}
//                 </div>

//                 <div className="flex justify-center items-center">
//                         <div className="mt-12 mb-12 w-11/12 max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl min-h-screen p-4 px-20 h-auto flex flex-col items-center">
//                                 <div className="w-full text-center">
//                                         <h1 className="text-4xl font-bold mb-6 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
//                                                 Mangrove Analysis in Sri Lanka
//                                         </h1>

//                                         {/* Grid layout for charts */}
//                                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
//                                                 {/* 2015 Line Chart */}
//                                                 <div className="bg-white/20 p-4 rounded-lg shadow w-full">
//                                                         <h2 className="text-xl font-semibold text-green-900 mb-4">Mangrove Extension in 2015</h2>
//                                                         <div className="h-64 flex justify-center items-center">
//                                                                 <Line data={lineData2015} options={chartOptions} />
//                                                         </div>
//                                                 </div>
                                                
//                                                 {/* 2026 Line Chart */}
//                                                 <div className="bg-white/20 p-4 rounded-lg shadow w-full">
//                                                         <h2 className="text-xl font-semibold text-blue-900 mb-4">Predicted Mangrove Extension in 2026</h2>
//                                                         <div className="h-64 flex justify-center items-center">
//                                                                 <Line data={lineData2026} options={chartOptions} />
//                                                         </div>
//                                                 </div>
//                                         </div>
                                        
//                                         {/* Comparison Bar Chart */}
//                                         <div className="mt-8 bg-white/20 p-4 rounded-lg shadow w-full">
//                                                 <h2 className="text-xl font-semibold text-gray-700 mb-4">Comparison: 2015 vs 2026 (Predicted)</h2>
//                                                 <div className="h-72 flex justify-center items-center">
//                                                         <Bar data={comparisonData} options={chartOptions} />
//                                                 </div>
//                                         </div>
//                                 </div>
//                         </div>
//                 </div>
//                 <div className="z-20 fixed bottom-8 right-5">
//                 <a 
//                     href="#top" 
//                     className="flex items-center justify-center w-12 h-12 bg-green-600/90 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
//                     aria-label="Back to top"
//                 >
//                     <ArrowUp size={20} />
//                 </a>
//                 </div>
//                 <Footer /> {/* Footer component */}
//         </div>
//     );
// }

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Rectangle, Popup, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"
import L from "leaflet"; // Import Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png"; // Import marker icon
import markerIconShadow from "leaflet/dist/images/marker-shadow.png"; // Import marker shadow
import {ArrowUp} from "lucide-react"

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
      <div className="z-20 fixed bottom-8 right-5">
      <a 
        href="#top" 
        className="flex items-center justify-center w-12 h-12 bg-green-600/90 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </a>
    </div>
      <Footer />
    </div>
  )
}

export default Mapping

