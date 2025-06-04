import React, { useState } from 'react';
import { FaUserMd, FaFileInvoiceDollar } from 'react-icons/fa';
import { MdPending } from 'react-icons/md';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js modules
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState('This Month');

  const salesDataByRange = {
    'This Week': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [10000, 12000, 9000, 14000, 11000, 15000, 13000]
    },
    'This Month': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [20000, 25000, 22000, 17000]
    },
    'Last Month': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [18000, 21000, 20000, 16000]
    },
    'This Quarter': {
      labels: ['Jan', 'Feb', 'Mar'],
      data: [50000, 62000, 58000]
    },
    'Half Year': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [50000, 62000, 58000, 74000, 67000, 84500]
    },
    'This Year': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      data: [50000, 62000, 58000, 74000, 67000, 84500, 90000, 95000]
    }
  };

  const currentData = salesDataByRange[selectedRange];

  const salesData = {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: currentData.data,
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#1D4ED8',
        pointBorderColor: '#1D4ED8',
        pointRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#374151',
          font: { size: 14 }
        }
      },
      title: {
        display: true,
        text: `Revenue Trends (${selectedRange})`,
        font: { size: 20 },
        color: '#111827',
        padding: { top: 10, bottom: 20 }
      }
    },
    scales: {
      x: {
        ticks: { color: '#6B7280', font: { size: 12 } },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
          color: '#6B7280',
          font: { size: 12 }
        },
        grid: {
          color: '#E5E7EB'
        }
      }
    }
  };

  const rangeOptions = ['This Week', 'This Month', 'Last Month', 'This Quarter', 'Half Year', 'This Year'];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Clinic Management Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard icon={<FaFileInvoiceDollar />} label="Revenue" value="₹84,500" color="bg-yellow-500" />
        <DashboardCard icon={<FaUserMd />} label="Available Doctors" value="15" color="bg-purple-500" />
        <DashboardCard icon={<MdPending />} label="Pending Amount" value="₹25,000" color="bg-red-500" />
      </div>

      {/* Revenue Line Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Revenue Trends</h2>
          <select
            className="border border-gray-300 rounded-md p-2 text-gray-700"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            {rangeOptions.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
        <div className="h-80">
          <Line data={salesData} options={options} />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, label, value, color }) => (
  <div className={`p-4 rounded-lg shadow text-white ${color} flex items-center justify-between`}>
    <div className="text-3xl">{icon}</div>
    <div className="text-right">
      <div className="text-sm">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default Dashboard;
