import React from 'react';
import { useNavigate } from 'react-router-dom';

const Billing = ({ bills, setBills }) => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this bill?');
    if (confirm) {
      const updatedBills = bills.filter((bill) => bill.id !== id);
      setBills(updatedBills);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-bill/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-green-900 drop-shadow-md text-center">
        Billing Records
      </h1>

      <button
        onClick={() => navigate('/add-bill')}
        className="mb-6 sm:mb-8 px-5 sm:px-6 py-2 sm:py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition transform"
      >
        Add New Bill
      </button>

      <div className="w-full overflow-x-auto max-w-7xl bg-white shadow-lg rounded-lg">
        <table className="w-full min-w-[1500px] text-left border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-3 border-r">S.no</th>
              <th className="px-4 py-3 border-r">Client ID</th>
              <th className="px-4 py-3 border-r">Client Name</th>
              <th className="px-4 py-3 border-r">Assigned Doctor</th>
              <th className="px-4 py-3 border-r">Services</th>
              <th className="px-4 py-3 border-r">Sessions</th>
              <th className="px-4 py-3 border-r">Cost ($)</th>
              <th className="px-4 py-3 border-r">Date</th>
              <th className="px-4 py-3 border-r">Payment Status</th>
              <th className="px-4 py-3 border-r">Payment Method</th>
              <th className="px-4 py-3 border-r">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => (
              <tr key={bill.id} className="border-b hover:bg-green-50">
                <td className="px-4 py-2 border-r">{index + 1}</td>
                <td className="px-4 py-2 border-r">{bill.clientId}</td>
                <td className="px-4 py-2 border-r">{bill.clientName}</td>
                <td className="px-4 py-2 border-r">{bill.assignedDoctor}</td>
                <td className="px-4 py-2 border-r">{bill.services}</td>
                <td className="px-4 py-2 border-r">{bill.requiredSessions}</td>
                <td className="px-4 py-2 border-r">${bill.cost}</td>
                <td className="px-4 py-2 border-r">{bill.date}</td>
                <td className="px-4 py-2 border-r">{bill.paymentStatus}</td>
                <td className="px-4 py-2 border-r">{bill.paymentMethod}</td>
                <td className="px-4 py-2 border-r">{bill.insuranceProvider}</td>
                <td className="px-4 py-2 border-r">{bill.notes}</td>
                <td className="px-4 py-2 border-r">{bill.billedBy}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(bill.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bill.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
