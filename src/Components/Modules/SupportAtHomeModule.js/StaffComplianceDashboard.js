import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import "../../../Styles/StaffComplianceDashboard.css";
import Report from "../RosteringModule/Report"; // import the insights
import StaffInsights from "./StaffInsights";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const StaffComplianceDashboard = () => {
  const chartRef = useRef(null);

  const labels = [
    "10:30 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
  ];

  const dataValues = [3000, 4500, 3500, 6000, 7546, 8000, 7000];

  const data = {
    labels,
    datasets: [
      {
        label: "API Calls",
        data: dataValues,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(108, 99, 255, 0.2)");
          gradient.addColorStop(1, "rgba(108, 99, 255, 0)");
          return gradient;
        },
        borderColor: "#6C63FF",
        borderWidth: 3,
        pointBackgroundColor: "#6C63FF",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#FF4D4D",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} API Calls`,
        },
      },
    },
    scales: {
      x: {
        grid: { drawBorder: false, color: "#f0f0f0" },
      },
      y: {
        grid: { drawBorder: false, color: "#f0f0f0" },
        ticks: { beginAtZero: true },
      },
    },
  };

  return (
    <div className="compliance-dashboard">
      {/* Top Summary Cards */}
      <div className="summary-cards">
        <div className="card orange">
          <span className="icon">📂</span>
          <div>
            <p className="card-title">staff workers</p>
            <h3>3</h3>
          </div>
        </div>
        <div className="card purple">
          <span className="icon">🔄</span>
          <div>
            <p className="card-title">rostering managers</p>
            <h3>3456</h3>
          </div>
        </div>
        <div className="card blue">
          <span className="icon">👤</span>
          <div>
            <p className="card-title">clients</p>
            <h3>3</h3>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <Line ref={chartRef} data={data} options={options} />
      </div>

      {/* Scrollable Insights Section */}
      <div className="insights-scroll">
        <StaffInsights/>
      </div>
    </div>
  );
};

export default StaffComplianceDashboard;
