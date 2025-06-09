import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import jsonData from "../data/ipl-stats.json";
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
  { label: "Orange Cap", value: "orangeCap" },
  { label: "Most 4s", value: "mostFours" },
  { label: "Most 6s", value: "mostSixes" },
  { label: "Most Centuries", value: "mostCenturies" },
  { label: "Most Fifties", value: "mostFifties" },
];

function App() {
  const [season, setSeason] = useState(2025);
  const [statType, setStatType] = useState("orangeCap");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const seasonKey = String(season); // Convert to string to match JSON keys
    const seasonData = jsonData[seasonKey];

    if (seasonData && seasonData[statType]) {
      const cleaned = seasonData[statType].slice(0, 10).map((player) => ({
        name: player.player,
        value: parseInt(player.value.replace(/,/g, ""), 10),
      }));
      setFilteredData(cleaned);
    } else {
      setFilteredData([]);
    }
  }, [season, statType]);

  const chartData = {
    labels: filteredData.map((p) => p.name),
    datasets: [
      {
        label: statTypes.find((t) => t.value === statType)?.label,
        data: filteredData.map((p) => p.value),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Tailwind blue-500
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

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            value={season}
            onChange={(e) => setSeason(parseInt(e.target.value))}
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

        {filteredData.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p className="text-center text-gray-500">No data available.</p>
        )}

        <p className="text-center text-sm mt-4 text-gray-600">
          Showing top 10 players in selected category for IPL {season}.
        </p>
      </div>
    </div>
  );
}

export default App;
