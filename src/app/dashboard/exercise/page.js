"use client";

import { useState, useEffect } from "react";
import LogForm from "@/components/LogForm";
import LogEntry from "@/components/LogEntry";
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

export default function ExercisePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/wellness/logs?type=exercise");
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

  // Prepare chart data (exercise duration in minutes)
  const chartData = {
    labels: logs.map((log) => new Date(log.date).toLocaleDateString()),
    datasets: [
      {
        label: "Exercise Duration (min)",
        data: logs.map((log) => log.details.duration),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Exercise</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <Line data={chartData} />
      </div>
      <LogForm type="exercise" onSubmit={async (log) => {
        try {
          const res = await fetch("/api/wellness/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(log),
          });
          if (!res.ok) throw new Error("Failed to add log");
          const newLog = await res.json();
          setLogs([newLog, ...logs]);
        } catch (err) {
          alert(err.message);
        }
      }} />
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Your Exercise Logs</h2>
        {loading ? (
          <div>Loading logs...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : logs.length === 0 ? (
          <div>No logs yet.</div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <LogEntry
                key={log._id}
                log={log}
                onUpdate={async (updatedLog) => {
                  try {
                    const res = await fetch("/api/wellness/logs", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(updatedLog),
                    });
                    if (!res.ok) throw new Error("Failed to update log");
                    const logRes = await res.json();
                    setLogs(logs.map((l) => (l._id === logRes._id ? logRes : l)));
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                onDelete={async (id) => {
                  try {
                    const res = await fetch(`/api/wellness/logs?id=${id}`, {
                      method: "DELETE",
                    });
                    if (!res.ok) throw new Error("Failed to delete log");
                    setLogs(logs.filter((l) => l._id !== id));
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
