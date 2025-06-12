import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs'; // Import dayjs
import isoWeek from 'dayjs/plugin/isoWeek'; // Import isoWeek plugin
import isBetween from 'dayjs/plugin/isBetween'; // Import isBetween plugin

// Extend dayjs with plugins
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const ITEMS_PER_PAGE = 5;

const Reports = () => {
  const [targets, setTargets] = useState([]); // Staff targets
  const [bills, setBills] = useState([]);
  const [staffList, setStaffList] = useState([]); // All staff data
  const [loading, setLoading] = useState(true);

  const [staffPage, setStaffPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const [reportType, setReportType] = useState("staff"); // Default to staff

  // New state for search terms
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  // New state for staff report time range
  const [staffSelectedRange, setStaffSelectedRange] = useState('This Month'); // Default to 'This Month'
  // New state for client report time range
  const [clientSelectedRange, setClientSelectedRange] = useState('This Month'); // Default to 'This Month'

  // Formatter for Indian Rupee currency
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  // Helper to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [targetsRes, billsRes, staffRes] = await Promise.all([
          axios.get('/api/targets/staff'), // Fetches staff targets
          axios.get('/api/bills'), // Fetches bills
          axios.get('/api/staff'), // Fetches all staff (doctors and others)
        ]);

        setTargets(targetsRes.data);
        setBills(billsRes.data);
        setStaffList(staffRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        toast.error('Failed to fetch report data.', { position: 'top-right' });
      }
    };

    fetchData();
  }, []);

  // Function to compute summary for ALL STAFF, now filtered by date range
  const getFilteredStaffSummary = (allTargets, allBills, allStaffList, range, searchTerm) => {
    if (!allStaffList.length) return [];

    const today = dayjs();
    let filteredTargets = [];
    let filteredBills = [];

    // Filter targets and bills based on the selected range
    switch (range) {
      case 'This Month':
        filteredTargets = allTargets.filter(target => dayjs(target.createdAt).isSame(today, 'month'));
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isSame(today, 'month'));
        break;
      case 'Last Month':
        const lastMonth = today.subtract(1, 'month');
        filteredTargets = allTargets.filter(target => dayjs(target.createdAt).isSame(lastMonth, 'month'));
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isSame(lastMonth, 'month'));
        break;
      case 'This Quarter':
        const currentQuarter = Math.floor(today.month() / 3);
        const quarterStart = dayjs().month(currentQuarter * 3).startOf('month');
        const quarterEnd = quarterStart.add(3, 'month').subtract(1, 'day').endOf('day'); // End of quarter
        filteredTargets = allTargets.filter(target => dayjs(target.createdAt).isBetween(quarterStart, quarterEnd, null, '[]'));
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isBetween(quarterStart, quarterEnd, null, '[]'));
        break;
      case 'Half Year':
        // Assuming last 6 months from today
        const sixMonthsAgo = today.subtract(6, 'month').startOf('day');
        filteredTargets = allTargets.filter(target => dayjs(target.createdAt).isAfter(sixMonthsAgo));
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isAfter(sixMonthsAgo));
        break;
      case 'This Year':
        filteredTargets = allTargets.filter(target => dayjs(target.createdAt).isSame(today, 'year'));
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isSame(today, 'year'));
        break;
      default: // Default to showing all if range is not specified or recognized
        filteredTargets = allTargets;
        filteredBills = allBills;
        break;
    }

    const staffSummaryMap = {};

    // Initialize staff entries with capitalized names
    allStaffList.forEach(staff => {
      staffSummaryMap[staff._id] = {
        name: capitalizeFirstLetter(staff.name),
        salary: staff.salary,
        target: 0, // Initialize total target for the period
        achieved: 0, // Initialize total achieved for the period
        remaining: 0, // Will be calculated later
        role: staff.role,
        phone: staff.phone,
        experience: staff.experience,
        qualification: staff.qualification,
      };
    });

    // Aggregate targets from the filtered targets
    filteredTargets.forEach(target => {
      if (target.staffId && staffSummaryMap[target.staffId._id]) {
        staffSummaryMap[target.staffId._id].target += target.targetAmount;
      }
    });

    // Aggregate achieved amounts from the filtered bills
    filteredBills.forEach(bill => {
      const staff = allStaffList.find(s => s.name === bill.assignedStaff);
      if (staff && staffSummaryMap[staff._id]) {
        staffSummaryMap[staff._id].achieved += (bill.amountPaid || 0);
      }
    });

    const summary = Object.values(staffSummaryMap).map(staff => ({
      ...staff,
      remaining: staff.target - staff.achieved,
    }));

    // Filter staff summary based on search term (name)
    return summary.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };


  // Function to compute detailed client information (applying capitalization)
  const computeClientDetails = (allBills, range, searchTerm) => {
    const today = dayjs();
    let filteredBills = [];

    // Filter bills based on the selected range
    switch (range) {
      case 'This Month':
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isSame(today, 'month'));
        break;
      case 'Last Month':
        const lastMonth = today.subtract(1, 'month');
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isSame(lastMonth, 'month'));
        break;
      case 'This Quarter':
        const currentQuarter = Math.floor(today.month() / 3);
        const quarterStart = dayjs().month(currentQuarter * 3).startOf('month');
        const quarterEnd = quarterStart.add(3, 'month').subtract(1, 'day').endOf('day');
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isBetween(quarterStart, quarterEnd, null, '[]'));
        break;
      case 'Half Year':
        const sixMonthsAgo = today.subtract(6, 'month').startOf('day');
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isAfter(sixMonthsAgo));
        break;
      case 'This Year':
        filteredBills = allBills.filter(bill => dayjs(bill.createdAt).isSame(today, 'year'));
        break;
      default:
        filteredBills = allBills;
        break;
    }

    const clientMap = {}; // Use a map to group bills by client and service

    filteredBills.forEach((bill) => {
      const key = `${bill.clientName}-${bill.services}`;
      if (!clientMap[key]) {
        clientMap[key] = {
          name: capitalizeFirstLetter(bill.clientName), // Capitalize client name
          service: bill.services,
          totalSessions: bill.totalSessions || 0,
          done: bill.sessionsCompleted || 0,
          paid: bill.amountPaid || 0,
          totalAmount: bill.totalAmount || 0,
        };
      } else {
        clientMap[key].totalSessions += bill.totalSessions || 0;
        clientMap[key].done += bill.sessionsCompleted || 0;
        clientMap[key].paid += bill.amountPaid || 0;
        clientMap[key].totalAmount += bill.totalAmount || 0;
      }
    });

    const details = Object.values(clientMap).map((client) => ({
      ...client,
      pending: client.totalSessions - client.done,
      balance: client.totalAmount - client.paid,
    }));

    // Filter client details based on search term
    return details.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Display a loading message while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-green-50 to-green-100 p-8 font-sans">
        <h1 className="text-4xl font-extrabold mb-6 text-green-900 tracking-wide">
          Clinic Reports
        </h1>
        <p className="text-xl text-green-700 animate-pulse">Loading data...</p>
      </div>
    );
  }

  const staffSummary = getFilteredStaffSummary(targets, bills, staffList, staffSelectedRange, staffSearchTerm);
  const clientDetails = computeClientDetails(bills, clientSelectedRange, clientSearchTerm);

  // Helper function for pagination
  const paginate = (array, page) => array.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const staffPageCount = Math.ceil(staffSummary.length / ITEMS_PER_PAGE);
  const clientPageCount = Math.ceil(clientDetails.length / ITEMS_PER_PAGE);

  const dateRangeOptions = ['This Month', 'Last Month', 'This Quarter', 'Half Year', 'This Year'];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-green-50 to-green-100 flex flex-col items-center max-w-7xl mx-auto font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-4xl font-extrabold mb-8 text-green-900 tracking-wide">
        Clinic Reports
      </h1>

      {/* Dropdown to select report type */}
      <div className="mb-10">
        <select
          className="px-4 py-2 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-medium text-green-800"
          value={reportType}
          onChange={(e) => {
            setReportType(e.target.value);
            setStaffPage(1);
            setClientPage(1);
            setStaffSearchTerm(''); // Clear search terms on tab change
            setClientSearchTerm(''); // Clear search terms on tab change
          }}
        >
          <option value="staff">Staff Data</option>
          <option value="client">Client Data</option>
        </select>
      </div>

      {/* Conditionally Render Staff Data Section */}
      {reportType === 'staff' && (
        <section className="w-full bg-white p-8 rounded-xl shadow-lg border border-green-200 mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
            <h3 className="text-3xl font-semibold text-green-900 tracking-tight">
              Staff Data
            </h3>
            {/* Staff Search Bar and Time Range Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-2/3 md:w-1/2">
              <select
                value={staffSelectedRange}
                onChange={(e) => setStaffSelectedRange(e.target.value)}
                className="border border-gray-300 text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
              >
                {dateRangeOptions.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <div className="relative flex items-center group flex-grow">
                <input
                  type="text"
                  placeholder="Search staff by name..."
                  className="w-full pl-10 pr-10 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-800 transition-all duration-200"
                  value={staffSearchTerm}
                  onChange={(e) => {
                    setStaffSearchTerm(e.target.value);
                    setStaffPage(1); // Reset page to 1 on new search
                  }}
                />
                {/* Search Icon */}
                <svg className="absolute left-3 w-5 h-5 text-green-500 group-focus-within:text-green-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {/* Clear Button */}
                {staffSearchTerm && (
                  <button
                    onClick={() => {
                      setStaffSearchTerm('');
                      setStaffPage(1);
                    }}
                    className="absolute right-3 p-1 rounded-full text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="min-w-full border-collapse">
              <thead className="bg-green-700 text-white text-sm sm:text-base">
                <tr>
                  <th className="px-6 py-3 border-r border-green-600 text-left rounded-tl-lg">S.No.</th>
                  {['Staff Name', 'Salary', 'Target Amount', 'Achieved', 'Remaining'].map(header => (
                    <th key={header} className="px-6 py-3 border-r border-green-600 last:border-r-0 text-center">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-green-900 text-sm sm:text-base">
                {paginate(staffSummary, staffPage).map((staff, idx) => (
                  <tr
                    key={staff.name}
                    className={`border-b border-green-300 ${idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'} hover:bg-green-200 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 font-medium border-r border-green-200 text-center">{(staffPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="px-6 py-4 font-medium border-r border-green-200 text-center">{staff.name}</td>
                    <td className="px-6 py-4 border-r border-green-200 text-center">{inrFormatter.format(staff.salary)}</td>
                    <td className="px-6 py-4 text-center font-mono border-r border-green-200">{inrFormatter.format(staff.target)}</td>
                    <td className="px-6 py-4 text-center font-mono border-r border-green-200">{inrFormatter.format(staff.achieved)}</td>
                    <td className="px-6 py-4 text-center font-mono">{inrFormatter.format(staff.remaining)}</td>
                  </tr>
                ))}
                {staffSummary.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No staff data available or matches your search for the selected period.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination for Staff Data */}
            {staffPageCount > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-3">
                <button
                  onClick={() => setStaffPage(prev => Math.max(prev - 1, 1))}
                  disabled={staffPage === 1}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                >
                  Previous
                </button>
                <span className="text-green-800 font-semibold">Page {staffPage} of {staffPageCount}</span>
                <button
                  onClick={() => setStaffPage(prev => Math.min(prev + 1, staffPageCount))}
                  disabled={staffPage === staffPageCount}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Conditionally Render Client Data Section */}
      {reportType === 'client' && (
        <section className="w-full bg-white p-8 rounded-xl shadow-lg border border-green-200">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
            <h3 className="text-3xl font-semibold text-green-900 tracking-tight">
              Client Data
            </h3>
            {/* Client Search Bar and Time Range Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-2/3 md:w-1/2">
              <select
                value={clientSelectedRange}
                onChange={(e) => setClientSelectedRange(e.target.value)}
                className="border border-gray-300 text-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
              >
                {dateRangeOptions.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <div className="relative flex items-center group flex-grow">
                <input
                  type="text"
                  placeholder="Search clients by name or service..."
                  className="w-full pl-10 pr-10 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-800 transition-all duration-200"
                  value={clientSearchTerm}
                  onChange={(e) => {
                    setClientSearchTerm(e.target.value);
                    setClientPage(1); // Reset page to 1 on new search
                  }}
                />
                {/* Search Icon */}
                <svg className="absolute left-3 w-5 h-5 text-green-500 group-focus-within:text-green-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {/* Clear Button */}
                {clientSearchTerm && (
                  <button
                    onClick={() => {
                      setClientSearchTerm('');
                      setClientPage(1);
                    }}
                    className="absolute right-3 p-1 rounded-full text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-inner">
            <table className="min-w-full border-collapse">
              <thead className="bg-green-700 text-white text-sm sm:text-base">
                <tr>
                  <th className="px-6 py-3 border-r border-green-600 text-left rounded-tl-lg">S.No.</th>
                  {[
                    'Client Name',
                    'Service',
                    'Sessions Completed',
                    'Pending Sessions',
                    'Paid / Total Amount',
                    'Balance',
                  ].map((header) => (
                    <th key={header} className="px-6 py-3 border-r border-green-600 last:border-r-0 text-center">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-green-900 text-sm sm:text-base">
                {paginate(clientDetails, clientPage).map((client, idx) => (
                  <tr
                    key={`${client.name}-${client.service}`}
                    className={`border-b border-green-300 ${idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'} hover:bg-green-200 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 font-medium border-r border-green-200 text-center">{(clientPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="px-6 py-4 font-medium border-r border-green-200 text-center">{client.name}</td>
                    <td className="px-6 py-4 border-r border-green-200 text-center">{client.service}</td>
                    <td className="px-6 py-4 border-r border-green-200 text-center">{client.done}</td>
                    <td className="px-6 py-4 border-r border-green-200 text-center">{client.pending}</td>
                    <td className="px-6 py-4 font-mono border-r border-green-200 text-center">{`${inrFormatter.format(client.paid)} / ${inrFormatter.format(client.totalAmount)}`}</td>
                    <td className="px-6 py-4 font-mono text-center">{inrFormatter.format(client.balance)}</td>
                  </tr>
                ))}
                {clientDetails.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No client data available or matches your search for the selected period.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination for Client Data */}
            {clientPageCount > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-3">
                <button
                  onClick={() => setClientPage(prev => Math.max(prev - 1, 1))}
                  disabled={clientPage === 1}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                >
                  Previous
                </button>
                <span className="text-green-800 font-semibold">Page {clientPage} of {clientPageCount}</span>
                <button
                  onClick={() => setClientPage(prev => Math.min(prev + 1, clientPageCount))}
                  disabled={clientPage === clientPageCount}
                  className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Reports;