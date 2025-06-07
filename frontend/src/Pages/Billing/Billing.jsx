import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('/api/bills');
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this bill?');
    if (confirmDelete) {
      try {
        await axios.delete(`/api/bills/${id}`);
        setBills((prev) => prev.filter((bill) => bill._id !== id));
        // Adjust page if current page ends up empty after deletion
        if ((bills.length - 1) <= (currentPage - 1) * ITEMS_PER_PAGE && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-bill/${id}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(bills.length / ITEMS_PER_PAGE);
  const paginatedBills = bills.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPrevious = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-10 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-green-900 drop-shadow-md text-center">
        Billing Records
      </h1>

      <button
        onClick={() => navigate('/add-bill')}
        className="mb-8 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition transform"
      >
        Add New Bill
      </button>

      <div className="w-full max-w-7xl overflow-x-auto bg-white shadow-lg rounded-lg border border-green-200">
        <table className="w-full min-w-[1400px] text-left border-collapse">
          <thead className="bg-green-600 text-white select-none">
            <tr>
              <th className="px-5 py-3 border-r whitespace-nowrap">S.no</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Client Name</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Assigned Doctor</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Services</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Total Sessions</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Sessions Completed</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Cost (₹)</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Amount Paid (₹)</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Date</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Payment Method</th>
              <th className="px-5 py-3 border-r whitespace-nowrap">Remarks</th>
              <th className="px-5 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBills.length > 0 ? (
              paginatedBills.map((bill, index) => (
                <tr
                  key={bill._id}
                  className="border-b hover:bg-green-50 transition-colors"
                >
                  <td className="px-5 py-3 border-r whitespace-nowrap">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">{bill.clientName}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">{bill.assignedDoctor}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap max-w-xs truncate" title={bill.services}>
                    {bill.services}
                  </td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">{bill.totalSessions}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">{bill.sessionsCompleted}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">₹{bill.cost}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">₹{bill.amountPaid}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">{bill.date?.split('T')[0]}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap">{bill.paymentMethod}</td>
                  <td className="px-5 py-3 border-r whitespace-nowrap max-w-xs truncate" title={bill.notes}>
                    {bill.notes || '-'}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap flex gap-3">
                    <button
                      onClick={() => handleEdit(bill._id)}
                      className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      aria-label={`Edit bill for ${bill.clientName}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bill._id)}
                      className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      aria-label={`Delete bill for ${bill.clientName}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-8 text-gray-500 text-lg font-medium">
                  No billing records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 select-none">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border border-green-600 font-semibold text-green-700
              hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>
          <span className="font-semibold text-green-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border border-green-600 font-semibold text-green-700
              hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Billing;
