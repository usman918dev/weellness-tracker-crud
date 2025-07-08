"use client";

import { useState, useEffect } from "react";
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

export default function ReportsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/wellness/logs");
        if (!res.ok) throw new Error("Failed to load logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  // Example: Show all types in one chart (water, sleep, exercise, mood)
  const waterData = logs.filter((l) => l.type === "water");
  const sleepData = logs.filter((l) => l.type === "sleep");
  const exerciseData = logs.filter((l) => l.type === "exercise");
  const moodData = logs.filter((l) => l.type === "mood");

  const chartData = {
    labels: logs.map((log) => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: "Water (ml)",
        data: waterData.map((log) => log.details.amount),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: false,
        yAxisID: "y",
      },
      {
        label: "Sleep (hrs)",
        data: sleepData.map((log) => {
          if (!log.details.startTime || !log.details.endTime) return 0;
          const start = new Date(log.details.startTime);
          const end = new Date(log.details.endTime);
          return (end - start) / (1000 * 60 * 60);
        }),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: false,
        yAxisID: "y1",
      },
      {
        label: "Exercise (min)",
        data: exerciseData.map((log) => log.details.duration),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: false,
        yAxisID: "y2",
      },
      {
        label: "Mood (1-5)",
        data: moodData.map((log) => log.details.rating),
        borderColor: "rgb(234, 179, 8)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        fill: false,
        yAxisID: "y3",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Wellness Overview",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: { display: true, text: "Water (ml)" },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Sleep (hrs)" },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Exercise (min)" },
      },
      y3: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Mood (1-5)" },
        min: 1,
        max: 5,
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">All Logs</h2>
        {loading ? (
          <div>Loading logs...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : logs.length === 0 ? (
          <div>No logs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b text-left text-xs font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-3 py-2 border-b text-left text-xs font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-3 py-2 border-b text-left text-xs font-semibold text-gray-700">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 text-xs text-gray-900">
                      {new Date(log.date).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900 capitalize">
                      {log.type}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-900">
                      {log.type === "water" && `${log.details.amount} ml`}
                      {log.type === "sleep" &&
                        log.details.startTime &&
                        log.details.endTime &&
                        `${new Date(
                          log.details.startTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${new Date(
                          log.details.endTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      {log.type === "exercise" &&
                        `${log.details.exerciseType} (${log.details.duration} min)`}
                      {log.type === "mood" &&
                        `Rating: ${log.details.rating}${
                          log.details.notes
                            ? " - " + log.details.notes
                            : ""
                        }`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
