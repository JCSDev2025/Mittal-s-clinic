import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [doctors, setDoctors] = useState([]);
  const [targets, setTargets] = useState([]);
  const [bills, setBills] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [staffPage, setStaffPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const [reportType, setReportType] = useState("staff"); // Default to staff

  const itemsPerPage = 5;

  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, targetsRes, billsRes, staffRes] = await Promise.all([
          axios.get('/api/doctors'),
          axios.get('/api/targets'),
          axios.get('/api/bills'),
          axios.get('/api/staff'),
        ]);

        setDoctors(doctorsRes.data);
        setTargets(targetsRes.data);
        setBills(billsRes.data);
        setStaffList(staffRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const computeStaffSummary = () => {
    return doctors.map((doctor) => {
      const doctorTargets = targets.filter(
        (target) => target.doctorId && target.doctorId._id === doctor._id
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
        salary: doctor.salary,
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
          totalAmount: bill.totalAmount || 0,
        };
      } else {
        clientMap[key].totalSessions += bill.totalSessions || 0;
        clientMap[key].done += bill.sessionsCompleted || 0;
        clientMap[key].paid += bill.amountPaid || 0;
        clientMap[key].totalAmount += bill.totalAmount || 0;
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
  const paginate = (array, page) => array.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const staffPageCount = Math.ceil(staffSummary.length / itemsPerPage);
  const clientPageCount = Math.ceil(clientDetails.length / itemsPerPage);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-green-50 to-green-100 flex flex-col items-center max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-green-900 tracking-wide">
        Clinic Reports
      </h1>

      {/* Dropdown filter */}
      <div className="mb-10">
        <select
          className="px-4 py-2 border border-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="staff">Staff Data</option>
          <option value="doctor">Doctors Data</option>
          <option value="client">Client Data</option>
        </select>
      </div>

      {/* Conditionally Render Sections */}
      {reportType === 'doctor' && (
        <section className="w-full bg-white p-8 rounded-xl shadow-lg border border-green-200 mb-12">
          <h3 className="text-3xl font-semibold text-green-900 mb-6 text-center tracking-tight">
            Doctors Data
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-green-300 rounded-md">
              <thead className="bg-green-700 text-white text-sm sm:text-base">
                <tr>
                  <th className="px-6 py-3 border border-green-600 text-left">S.No.</th>
                  {['Doctor Name', 'Salary', 'Target', 'Achieved', 'Remaining'].map((header) => (
                    <th key={header} className="px-6 py-3 border border-green-600 text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-green-900 text-sm sm:text-base">
                {paginate(staffSummary, staffPage).map((doc, idx) => (
                  <tr
                    key={doc.name}
                    className={`border border-green-300 ${idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'}`}
                  >
                    <td className="px-6 py-4 font-medium">{(staffPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-6 py-4 font-medium">{doc.name}</td>
                    <td className="px-6 py-4 font-mono">{inrFormatter.format(doc.salary)}</td>
                    <td className="px-6 py-4 text-right font-mono">{inrFormatter.format(doc.target)}</td>
                    <td className="px-6 py-4 text-right font-mono">{inrFormatter.format(doc.achieved)}</td>
                    <td className="px-6 py-4 text-right font-mono">{inrFormatter.format(doc.remaining)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {reportType === 'staff' && (
        <section className="w-full bg-white p-8 rounded-xl shadow-lg border border-green-200 mb-12">
          <h3 className="text-3xl font-semibold text-green-900 mb-6 text-center tracking-tight">
            Staff Data
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-green-300 rounded-md">
              <thead className="bg-green-700 text-white text-sm sm:text-base">
                <tr>
                  {['S.No.', 'Name', 'Role', 'Phone', 'Experience', 'Qualification', 'Salary'].map(header => (
                    <th key={header} className="px-6 py-3 border border-green-600 text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-green-900 text-sm sm:text-base">
                {staffList.map((staff, idx) => (
                  <tr
                    key={staff._id}
                    className={`border border-green-300 ${idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'}`}
                  >
                    <td className="px-6 py-4 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4">{staff.name}</td>
                    <td className="px-6 py-4">{staff.role}</td>
                    <td className="px-6 py-4">{staff.phone}</td>
                    <td className="px-6 py-4">{staff.experience} yrs</td>
                    <td className="px-6 py-4">{staff.qualification}</td>
                    <td className="px-6 py-4 font-mono">{inrFormatter.format(staff.salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {reportType === 'client' && (
        <section className="w-full bg-white p-8 rounded-xl shadow-lg border border-green-200">
          <h3 className="text-3xl font-semibold text-green-900 mb-6 text-center tracking-tight">
            Client Data
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
                    <th key={header} className="px-6 py-3 border border-green-600 text-left">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-green-900 text-sm sm:text-base">
                {paginate(clientDetails, clientPage).map((client, idx) => (
                  <tr
                    key={`${client.name}-${client.service}`}
                    className={`border border-green-300 ${idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'}`}
                  >
                    <td className="px-6 py-4 font-medium">{(clientPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-6 py-4 font-medium">{client.name}</td>
                    <td className="px-6 py-4">{client.service}</td>
                    <td className="px-6 py-4">{client.done}</td>
                    <td className="px-6 py-4">{client.pending}</td>
                    <td className="px-6 py-4 font-mono">{`${inrFormatter.format(client.paid)} / ${inrFormatter.format(client.totalAmount)}`}</td>
                    <td className="px-6 py-4 font-mono">{inrFormatter.format(client.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default Reports;
