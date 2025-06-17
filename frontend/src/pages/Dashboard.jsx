
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import TypingTest from "../components/TypingTest";

Chart.register(...registerables);

function Dashboard() {
  const navigate = useNavigate();
  const [wpmData, setWpmData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/wpm/latest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const lastFive = res.data.slice(-5).reverse(); 
        setWpmData(lastFive);
      })
      .catch(() => {
        alert("Session expired or error occurred.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const chartData = {
    labels: wpmData.map((_, i) => `Test ${5 - i}`),
    datasets: [
      {
        label: "WPM",
        data: wpmData.map((item) => item.wpm),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "WPM" },
      },
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Typing Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-center">Start Your Typing Test</h3>
        <TypingTest onSave={() => window.location.reload()} />

        <div className="mt-12 w-full max-w-xl mx-auto">
          <h4 className="text-lg font-semibold mb-2 text-center">Your Last 5 Typing Speeds</h4>
          <div className="relative h-[300px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
