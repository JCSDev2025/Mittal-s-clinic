import React from 'react';

const Reports = () => {
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const staffTargets = [
    { name: 'Mounika', target: 500000, achieved: 200000 },
    { name: 'Raj', target: 300000, achieved: 220000 },
    { name: 'Anjali', target: 400000, achieved: 100000 },
  ];

  const clientPackages = [
    {
      name: 'Srinivas Rao',
      packageName: 'GFC',
      totalSessions: 5,
      completedSessions: 2,
      totalAmount: 100000,
      paidAmount: 50000,
    },
    {
      name: 'Neha Sharma',
      packageName: 'Slim Fit',
      totalSessions: 10,
      completedSessions: 6,
      totalAmount: 80000,
      paidAmount: 70000,
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-green-50 to-green-100 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-10 text-green-900">Clinic Reports</h1>

      {/* Staff-wise Sales Summary */}
      <section className="w-full max-w-4xl mt-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold text-green-800 mb-6 text-center">
          Staff-wise Sales Summary
        </h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-6 py-3 border border-green-600">Staff Name</th>
              <th className="px-6 py-3 border border-green-600">Target</th>
              <th className="px-6 py-3 border border-green-600">Achieved</th>
              <th className="px-6 py-3 border border-green-600">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {staffTargets.map(({ name, target, achieved }, idx) => (
              <tr
                key={name}
                className={`border border-green-300 ${
                  idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'
                }`}
              >
                <td className="px-6 py-4">{name}</td>
                <td className="px-6 py-4 text-right">{inrFormatter.format(target)}</td>
                <td className="px-6 py-4 text-right">{inrFormatter.format(achieved)}</td>
                <td className="px-6 py-4 text-right">
                  {inrFormatter.format(target - achieved)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Client Package Details */}
      <section className="w-full max-w-4xl mt-16 bg-white p-6 rounded-lg shadow-md mb-10">
        <h3 className="text-3xl font-semibold text-green-800 mb-6 text-center">
          Client Package Tracking
        </h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-4 py-3 border border-green-600">Client Name</th>
              <th className="px-4 py-3 border border-green-600">Package</th>
              <th className="px-4 py-3 border border-green-600">Sessions Done / Total</th>
              <th className="px-4 py-3 border border-green-600">Pending Sessions</th>
              <th className="px-4 py-3 border border-green-600">Paid / Total Amount</th>
              <th className="px-4 py-3 border border-green-600">Balance</th>
            </tr>
          </thead>
          <tbody>
            {clientPackages.map((client, idx) => (
              <tr
                key={client.name}
                className={`border border-green-300 ${
                  idx % 2 === 0 ? 'bg-green-50' : 'bg-green-100'
                }`}
              >
                <td className="px-4 py-3">{client.name}</td>
                <td className="px-4 py-3">{client.packageName}</td>
                <td className="px-4 py-3 text-center">
                  {client.completedSessions} / {client.totalSessions}
                </td>
                <td className="px-4 py-3 text-center">
                  {client.totalSessions - client.completedSessions}
                </td>
                <td className="px-4 py-3 text-right">
                  {inrFormatter.format(client.paidAmount)} /{' '}
                  {inrFormatter.format(client.totalAmount)}
                </td>
                <td className="px-4 py-3 text-right">
                  {inrFormatter.format(client.totalAmount - client.paidAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Reports;
