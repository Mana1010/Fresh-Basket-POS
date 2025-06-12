import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DailySalesChart() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales data (replace with your actual API call)
  useEffect(() => {
    fetchDailySales();
  }, []);

  const fetchDailySales = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/daily-sales');
      // const data = await response.json();

      // Mock data for demonstration
      const mockData = [
        { day: "Mon", sales: 1200 },
        { day: "Tue", sales: 1900 },
        { day: "Wed", sales: 800 },
        { day: "Thu", sales: 1500 },
        { day: "Fri", sales: 2200 },
        { day: "Sat", sales: 2800 },
        { day: "Sun", sales: 1600 },
      ];

      setSalesData(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setLoading(false);
    }
  };

  // Prepare data for Chart.js
  const chartData = {
    labels: salesData.map((item) => item.day),
    datasets: [
      {
        label: "Daily Sales ($)",
        data: salesData.map((item) => item.sales),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Daily Sales Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  if (loading) {
    return <div>Loading sales data...</div>;
  }

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default DailySalesChart;
