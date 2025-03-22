import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { ArrowUp } from "lucide-react";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function MangroveAnalysis() {
  const [currentAreas, setCurrentAreas] = useState([]);
  const [predictedAreas, setPredictedAreas] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/mangrove-data");
        if (!response.ok) throw new Error("Failed to fetch data from the server");

        const data = await response.json();

        // Update state with fetched data
        setAreaNames(data.map((item) => item.area));
        setCurrentAreas(data.map((item) => item.area_2015));
        setPredictedAreas(data.map((item) => item.predicted_area_2026));
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);

        // Fallback to research data
        const dummyData = [
          { area: "Western Region", area_2015: 20.7, predicted_area_2026: 21.1 },
          { area: "Northern Region", area_2015: 25.05, predicted_area_2026: 25.1 },
          { area: "Eastern Coast", area_2015: 23.0, predicted_area_2026: 23.2 },
          { area: "Southern Region", area_2015: 11.3, predicted_area_2026: 10.5 },
          { area: "Mannar", area_2015: 13.5, predicted_area_2026: 13.7 },
        ];

        setAreaNames(dummyData.map((item) => item.area));
        setCurrentAreas(dummyData.map((item) => item.area_2015));
        setPredictedAreas(dummyData.map((item) => item.predicted_area_2026));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Chart data and options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Important for responsiveness
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Area (sq km)",
          color: "black",
        },
        beginAtZero: true,
        grid: {
          color: "rgba(29, 24, 24, 0.2)",
        },
        ticks: {
          color: "black",
        },
      },
      x: {
        title: {
          display: true,
          text: "Location",
          color: "black",
        },
        grid: {
          color: "rgba(29, 24, 24, 0.2)",
        },
        ticks: {
          color: "black",
        },
      },
    },
  };

  const lineData2015 = {
    labels: areaNames,
    datasets: [
      {
        label: "Mangrove Extension 2015",
        data: currentAreas,
        borderColor: "rgba(15, 111, 50, 0.7)",
        backgroundColor: "rgba(15, 111, 50, 0.7)",
        tension: 0.3,
      },
    ],
  };

  const lineData2026 = {
    labels: areaNames,
    datasets: [
      {
        label: "Predicted Mangrove Extension 2026",
        data: predictedAreas,
        borderColor: "rgba(35, 75, 139, 0.7)",
        backgroundColor: "rgba(35, 75, 139, 0.7)",
        tension: 0.3,
      },
    ],
  };

  const comparisonData = {
    labels: areaNames,
    datasets: [
      {
        label: "2015",
        data: currentAreas,
        backgroundColor: "rgba(15, 111, 50, 0.7)",
      },
      {
        label: "2026 (Predicted)",
        data: predictedAreas,
        backgroundColor: "rgba(35, 75, 139, 0.7)",
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div
      className="bg-cover min-h-screen bg-fixed"
      style={{ backgroundImage: "url('/imgs/monitoring/background2.jpg')" }}
    >
      <Navbar />

      <div className="flex justify-center items-center px-4 sm:px-6 md:px-8">
        <div className="mt-12 mb-12 w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-10 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-white text-center">
            Mangrove Analysis in Sri Lanka
          </h1>

          {/* Grid for Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="bg-white/20 p-4 rounded-lg shadow w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-green-900 mb-4 text-center">
                Mangrove Extension in 2015
              </h2>
              <div className="h-64 sm:h-80 flex justify-center items-center">
                <Line data={lineData2015} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white/20 p-4 rounded-lg shadow w-full">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4 text-center">
                Predicted Mangrove Extension in 2026
              </h2>
              <div className="h-64 sm:h-80 flex justify-center items-center">
                <Line data={lineData2026} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="mt-8 bg-white/20 p-4 rounded-lg shadow w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
              Comparison: 2015 vs 2026 (Predicted)
            </h2>
            <div className="h-72 sm:h-96 flex justify-center items-center">
              <Bar data={comparisonData} options={chartOptions} />
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
      <Footer />
    </div>
  );
}
