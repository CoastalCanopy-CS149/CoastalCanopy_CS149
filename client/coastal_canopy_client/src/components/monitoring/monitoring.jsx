import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Monitoring() {
  const [data, setData] = useState({ historical: {}, predictions: {} });

  useEffect(() => {
    // Fetch data from the Flask API
    axios.get('http://127.0.0.1:5000/api/monitoring/mangrove-data') // Adjust the URL if needed
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Prepare the chart data
  const chartData = {
    labels: data.historical.years?.concat(data.predictions.years || []),
    datasets: [
      {
        label: 'Mangrove Extent (m²)',
        data: data.historical.areas?.concat(data.predictions.areas || []),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/imgs/monitoring/background1.jpg')" }}
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
            Mangrove Destruction Analysis & Trends
          </h1>
          {/* Line Chart */}
          {data.historical.years ? (
            <Line data={chartData} />
          ) : (
            <p className="text-center text-gray-500">Loading data...</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Monitoring;
