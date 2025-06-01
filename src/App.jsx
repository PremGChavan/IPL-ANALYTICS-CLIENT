import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const seasons = [2025, 2024, 2023, 2022, 2021];
const statTypes = [
  { label: "Orange Cap", value: "orange-cap" },
  { label: "Most 4s", value: "most-fours" },
  { label: "Most 6s", value: "most-sixes" },
  { label: "Most Centuries", value: "most-centuries" },
  { label: "Most Fifties", value: "most-fifties" },
];

function App() {
  const [season, setSeason] = useState(2025);
  const [statType, setStatType] = useState("orange-cap");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/stats?season=${season}&type=${statType}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [season, statType]);

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: statTypes.find((t) => t.value === statType)?.label,
        data: data.map((d) => d.value),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // blue-500
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          IPL Stats Dashboard
        </h1>

        <div className="flex gap-4 justify-center mb-6">
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                Season {s}
              </option>
            ))}
          </select>

          <select
            value={statType}
            onChange={(e) => setStatType(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            {statTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Bar data={chartData} />

        <p className="text-center text-sm mt-4 text-gray-600">
          Top 10 players in the selected category for IPL {season}.
        </p>
      </div>
    </div>
  );
}

export default App;
