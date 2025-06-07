import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [doctors, setDoctors] = useState([]);
  const [targets, setTargets] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state for staff and clients tables
  const [staffPage, setStaffPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const itemsPerPage = 5;

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, targetsRes, billsRes] = await Promise.all([
          axios.get('/api/doctors'),
          axios.get('/api/targets'),
          axios.get('/api/bills'),
        ]);

        setDoctors(doctorsRes.data);
        setTargets(targetsRes.data);
        setBills(billsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate summaries
  const computeStaffSummary = () => {
    return doctors.map((doctor) => {
      const doctorTargets = targets.filter(
        (target) => target.doctorId._id === doctor._id
      );
      const totalTarget = doctorTargets.reduce(
        (sum, target) => sum + target.targetAmount,
        0
      );

      const doctorBills = bills.filter(
        (bill) => bill.assignedDoctor === doctor.name
      );

      const totalAchieved = doctorBills.reduce(
        (sum, bill) => sum + bill.amountPaid,
        0
      );

      return {
        name: doctor.name,
        target: totalTarget,
        achieved: totalAchieved,
        remaining: totalTarget - totalAchieved,
      };
    });
  };

  const computeClientDetails = () => {
    const clientMap = {};

    bills.forEach((bill) => {
      const key = `${bill.clientName}-${bill.services}`;
      if (!clientMap[key]) {
        clientMap[key] = {
          name: bill.clientName,
          service: bill.services,
          totalSessions: bill.totalSessions || 0,
          done: bill.sessionsCompleted || 0,
          paid: bill.amountPaid || 0,
          totalAmount: bill.cost || 0,
        };
      } else {
        clientMap[key].totalSessions += bill.totalSessions || 0;
        clientMap[key].done += bill.sessionsCompleted || 0;
        clientMap[key].paid += bill.amountPaid || 0;
        clientMap[key].totalAmount += bill.cost || 0;
      }
    });

    return Object.values(clientMap).map((client) => ({
      ...client,
      pending: client.totalSessions - client.done,
      balance: client.totalAmount - client.paid,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-green-50 to-green-100 p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-green-900 tracking-wide">
          Clinic Reports
        </h1>
        <p className="text-xl text-green-700 animate-pulse">Loading data...</p>
      </div>
    );
  }

  const staffSummary = computeStaffSummary();
  const clientDetails = computeClientDetails();

  // Pagination helpers
  const paginate = (array, page) =>
    array.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const staffPageCount = Math.ceil(staffSummary.length / itemsPerPage);
  const clientPageCount = Math.ceil(clientDetails.length / itemsPerPage);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-green-50 to-green-100 flex flex-col items-center max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-12 text-green-900 tracking-wide">
        Clinic Reports
      </h1>

      {/* Staff-wise Sales Summary */}
      <section className="w-full bg-white p-8 rounded-xl shadow-lg border border-green-200 mb-12">
        <h3 className="text-3xl font-semibold text-green-900 mb-6 text-center tracking-tight">
          Doctors-wise Sales Summary
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-green-300 rounded-md">
            <thead className="bg-green-700 text-white text-sm sm:text-base">
              <tr>
                <th className="px-6 py-3 border border-green-600 text-left">S.No.</th>
                {['Doctor Name', 'Target', 'Achieved', 'Remaining'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 border border-green-600 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-green-900 text-sm sm:text-base">
              {paginate(staffSummary, staffPage).map(
                ({ name, target, achieved, remaining }, idx) => (
                  <tr
                    key={name}
                    className={`border border-green-300 ${
                      idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">
                      {(staffPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-4 font-medium">{name}</td>
                    <td className="px-6 py-4 text-right font-mono">
                      {inrFormatter.format(target)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {inrFormatter.format(achieved)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {inrFormatter.format(remaining)}
                    </td>
                  </tr>
                )
              )}
              {staffSummary.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic font-semibold"
                  >
                    No staff sales data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {staffPageCount > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            <button
              onClick={() => setStaffPage((p) => Math.max(p - 1, 1))}
              disabled={staffPage === 1}
              className="px-3 py-1 rounded-md text-green-700 border border-green-400 hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              &larr; Prev
            </button>

            {[...Array(staffPageCount)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === staffPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setStaffPage(pageNum)}
                  className={`px-3 py-1 rounded-md border transition ${
                    isActive
                      ? 'bg-green-700 text-white border-green-700'
                      : 'border-green-400 text-green-700 hover:bg-green-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setStaffPage((p) => Math.min(p + 1, staffPageCount))}
              disabled={staffPage === staffPageCount}
              className="px-3 py-1 rounded-md text-green-700 border border-green-400 hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>

      {/* Client Details */}
      <section className="w-full bg-white p-8 rounded-xl shadow-lg border border-green-200">
        <h3 className="text-3xl font-semibold text-green-900 mb-6 text-center tracking-tight">
          Client Details
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-green-300 rounded-md">
            <thead className="bg-green-700 text-white text-sm sm:text-base">
              <tr>
                <th className="px-6 py-3 border border-green-600 text-left">S.No.</th>
                {[
                  'Client Name',
                  'Service',
                  'Sessions Completed',
                  'Pending Sessions',
                  'Paid / Total Amount',
                  'Balance',
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 border border-green-600 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-green-900 text-sm sm:text-base">
              {paginate(clientDetails, clientPage).map((client, idx) => (
                <tr
                  key={`${client.name}-${client.service}`}
                  className={`border border-green-300 ${
                    idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'
                  }`}
                >
                  <td className="px-6 py-4 font-medium">
                    {(clientPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-6 py-4 font-medium">{client.name}</td>
                  <td className="px-6 py-4">{client.service}</td>
                  <td className="px-6 py-4">{client.done}</td>
                  <td className="px-6 py-4">{client.pending}</td>
                  <td className="px-6 py-4 font-mono">
                    {`${inrFormatter.format(client.paid)} / ${inrFormatter.format(
                      client.totalAmount
                    )}`}
                  </td>
                  <td className="px-6 py-4 font-mono">{inrFormatter.format(client.balance)}</td>
                </tr>
              ))}
              {clientDetails.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 italic font-semibold"
                  >
                    No client billing data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {clientPageCount > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            <button
              onClick={() => setClientPage((p) => Math.max(p - 1, 1))}
              disabled={clientPage === 1}
              className="px-3 py-1 rounded-md text-green-700 border border-green-400 hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              &larr; Prev
            </button>

            {[...Array(clientPageCount)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === clientPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setClientPage(pageNum)}
                  className={`px-3 py-1 rounded-md border transition ${
                    isActive
                      ? 'bg-green-700 text-white border-green-700'
                      : 'border-green-400 text-green-700 hover:bg-green-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setClientPage((p) => Math.min(p + 1, clientPageCount))}
              disabled={clientPage === clientPageCount}
              className="px-3 py-1 rounded-md text-green-700 border border-green-400 hover:bg-green-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Reports;
