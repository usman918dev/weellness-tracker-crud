'use client';

import { react, useState, useEffect } from 'react';
import { Card } from '@/components/ui';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import LogForm from '@/components/LogForm';
import LogEntry from '@/components/LogEntry';
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
const LOG_TYPES = [
  { value: 'water', label: 'Water Intake' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'mood', label: 'Mood' },
];

export default function Dashboard() {
  const [logType, setLogType] = useState('water');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch logs from API
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        let url = '/api/wellness/logs';
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length) url += '?' + params.join('&');
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [startDate, endDate]);

  // Add new log
  async function handleAddLog(log) {
    try {
      const res = await fetch('/api/wellness/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!res.ok) throw new Error('Failed to add log');
      const newLog = await res.json();
      setLogs([newLog, ...logs]);
    } catch (err) {
      alert(err.message);
    }
  }

  // Update log
  async function handleUpdateLog(updatedLog) {
    try {
      const res = await fetch('/api/wellness/logs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLog),
      });
      if (!res.ok) throw new Error('Failed to update log');
      const log = await res.json();
      setLogs(logs.map(l => l._id === log._id ? log : l));
    } catch (err) {
      alert(err.message);
    }
  }

  // Delete log
  async function handleDeleteLog(id) {
    try {
      const res = await fetch(`/api/wellness/logs?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete log');
      setLogs(logs.filter(l => l._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  // Prepare chart data for selected log type
  let filteredLogs = logs.filter(log => log.type === logType);
  if (search) {
    filteredLogs = filteredLogs.filter(log => {
      const details = JSON.stringify(log.details).toLowerCase();
      return details.includes(search.toLowerCase());
    });
  }

  let chartData = null;
  if (logType === 'water') {
    chartData = {
      labels: filteredLogs.map(log => new Date(log.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Water Intake (ml)',
          data: filteredLogs.map(log => log.details.amount),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
        },
      ],
    };
  } else if (logType === 'sleep') {
    chartData = {
      labels: filteredLogs.map(log => new Date(log.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Sleep Duration (hrs)',
          data: filteredLogs.map(log => {
            if (!log.details.startTime || !log.details.endTime) return 0;
            const start = new Date(log.details.startTime);
            const end = new Date(log.details.endTime);
            return (end - start) / (1000 * 60 * 60);
          }),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
        },
      ],
    };
  } else if (logType === 'exercise') {
    chartData = {
      labels: filteredLogs.map(log => new Date(log.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Exercise Duration (min)',
          data: filteredLogs.map(log => log.details.duration),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
        },
      ],
    };
  } else if (logType === 'mood') {
    chartData = {
      labels: filteredLogs.map(log => new Date(log.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Mood Rating (1-5)',
          data: filteredLogs.map(log => log.details.rating),
          borderColor: 'rgb(234, 179, 8)',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          fill: true,
        },
      ],
    };
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <label className="block text-sm font-medium text-gray-700">
          Log Type
          <select
            className="block mt-1 border border-gray-300 rounded-md p-2"
            value={logType}
            onChange={e => setLogType(e.target.value)}
          >
            {LOG_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
          <input
            type="date"
            className="block mt-1 border border-gray-300 rounded-md p-2"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          End Date
          <input
            type="date"
            className="block mt-1 border border-gray-300 rounded-md p-2"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 flex-1">
          Search
          <input
            type="text"
            className="block mt-1 border border-gray-300 rounded-md p-2 w-full"
            placeholder="Search logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Log form */}
      <div className="flex-1 w-full">
        <LogForm type={logType} onSubmit={handleAddLog} />
      </div>

      {/* Chart for selected log type */}
      {chartData && (
        <div className="bg-white rounded-lg shadow p-4">
          <Line data={chartData} />
        </div>
      )}

      {/* Log list */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Your Logs</h2>
        {loading ? (
          <div>Loading logs...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div>No logs yet.</div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map(log => (
              <LogEntry
                key={log._id}
                log={log}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
