import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState('This Month');
  const [revenue, setRevenue] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billsRes, doctorsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/bills'),
          axios.get('http://localhost:3000/api/doctors')
        ]);

        const billsData = billsRes.data;
        const doctorsData = doctorsRes.data;

        const totalRevenue = billsData.reduce((sum, bill) => sum + (bill.amountPaid || 0), 0);
        const totalPending = billsData.reduce((sum, bill) => sum + ((bill.cost || 0) - (bill.amountPaid || 0)), 0);

        setRevenue(totalRevenue);
        setPendingAmount(totalPending);
        setTotalDoctors(doctorsData.length);
        setBills(billsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getRevenueDataByRange = (bills, range) => {
    if (!bills.length) return { labels: [], data: [] };

    const today = dayjs();
    let labels = [], data = [];

    switch (range) {
      case 'Today': {
        labels = Array.from({ length: 24 }, (_, i) => `${i}h`);
        const hourlyTotals = Array(24).fill(0);
        bills.forEach(bill => {
          const billDate = dayjs(bill.date);
          if (billDate.isSame(today, 'day')) {
            hourlyTotals[billDate.hour()] += bill.amountPaid || 0;
          }
        });
        data = hourlyTotals;
        break;
      }
      case 'This Week': {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const startOfWeek = today.startOf('isoWeek');
        const dailyTotals = Array(7).fill(0);
        bills.forEach(bill => {
          const billDate = dayjs(bill.date);
          if (billDate.isBetween(startOfWeek.subtract(1, 'second'), startOfWeek.add(7, 'day'), null, '[)')) {
            dailyTotals[billDate.isoWeekday() - 1] += bill.amountPaid || 0;
          }
        });
        data = dailyTotals;
        break;
      }
      case 'This Month': {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const weeklyTotals = Array(4).fill(0);
        bills.forEach(bill => {
          const billDate = dayjs(bill.date);
          if (billDate.isSame(today, 'month')) {
            const weekNumber = Math.ceil(billDate.date() / 7);
            if (weekNumber <= 4) weeklyTotals[weekNumber - 1] += bill.amountPaid || 0;
          }
        });
        data = weeklyTotals;
        break;
      }
      case 'Last Month': {
        const lastMonth = today.subtract(1, 'month');
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const weeklyTotals = Array(4).fill(0);
        bills.forEach(bill => {
          const billDate = dayjs(bill.date);
          if (billDate.isSame(lastMonth, 'month')) {
            const weekNumber = Math.ceil(billDate.date() / 7);
            if (weekNumber <= 4) weeklyTotals[weekNumber - 1] += bill.amountPaid || 0;
          }
        });
        data = weeklyTotals;
        break;
      }
      case 'This Quarter': {
        const currentQuarter = Math.floor(today.month() / 3);
        const quarterStart = dayjs().month(currentQuarter * 3).startOf('month');
        labels = Array.from({ length: 3 }, (_, i) => quarterStart.add(i, 'month').format('MMM'));
        const monthlyTotals = Array(3).fill(0);
        bills.forEach(bill => {
          const billDate = dayjs(bill.date);
          if (billDate.isBetween(quarterStart.subtract(1, 'second'), quarterStart.add(3, 'month'), null, '[)')) {
            monthlyTotals[billDate.month() - quarterStart.month()] += bill.amountPaid || 0;
          }
        });
        data = monthlyTotals;
        break;
      }
      case 'Half Year': {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const monthlyTotals = Array(6).fill(0);
        bills.forEach(bill => {
          const billDate = dayjs(bill.date);
          if (billDate.isSame(today, 'year') && billDate.month() < 6) {
            monthlyTotals[billDate.month()] += bill.amountPaid || 0;
          }
        });
        data = monthlyTotals;
        break;
      }
      case 'This Year': {
        const monthCount = today.month() + 1;
        labels = Array.from({ length: monthCount }, (_, i) => dayjs().month(i).format('MMM'));
        const monthlyTotals = Array(monthCount).fill(0);
        bills.forEach(bill => {
          const billDate = dayjs(bill.date);
          if (billDate.isSame(today, 'year')) {
            monthlyTotals[billDate.month()] += bill.amountPaid || 0;
          }
        });
        data = monthlyTotals;
        break;
      }
      default:
        break;
    }

    return { labels, data };
  };

  const currentData = getRevenueDataByRange(bills, selectedRange);

  const salesData = {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: currentData.data,
        fill: true,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14,165,233,0.15)',
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#0284c7'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#334155' } },
      title: {
        display: true,
        text: `Revenue Trends (${selectedRange})`,
        color: '#1e293b',
        font: { size: 18 }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          callback: (value) => `₹${value}`
        },
        grid: { color: '#e2e8f0' }
      }
    }
  };

  const rangeOptions = ['Today', 'This Week', 'This Month', 'Last Month', 'This Quarter', 'Half Year', 'This Year'];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Clinic Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DashboardCard icon={<FaFileInvoiceDollar />} label="Total Revenue" value={`₹${revenue.toLocaleString()}`} bg="bg-yellow-100" text="text-yellow-800" />
        <DashboardCard icon={<FaUserMd />} label="Available Doctors" value={totalDoctors} bg="bg-green-100" text="text-green-800" />
        <DashboardCard icon={<MdPending />} label="Pending Amount" value={`₹${pendingAmount.toLocaleString()}`} bg="bg-red-100" text="text-red-800" />
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg font-semibold text-slate-700">Revenue Over Time</h2>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="border border-gray-300 text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {rangeOptions.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
        <div className="h-80 w-full">
          <Line data={salesData} options={options} />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, label, value, bg, text }) => (
  <div className={`rounded-xl shadow-md p-5 flex items-center justify-between ${bg} ${text}`}>
    <div className="text-4xl">{icon}</div>
    <div className="text-right">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default Dashboard;
