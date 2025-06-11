import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css'; // Removed to prevent compilation errors
import { UserGroupIcon } from '@heroicons/react/24/outline'; // Import Heroicons for empty state

const ITEMS_PER_PAGE = 10;

const ClientDetails = () => {
  const [clients, setClients] = useState([]);
  const [editedClients, setEditedClients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // States for custom delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('/api/bills'); // Assuming client details are fetched from bills endpoint
        setClients(res.data);
      } catch (err) {
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (id, field, value) => {
    setEditedClients((prev) => {
      const client = clients.find((c) => c._id === id);
      if (!client) return prev;
      let updatedClient = prev[id] ? { ...prev[id] } : { ...client };

      if (field === 'pendingSeatings') {
        const pending = Number(value);
        if (pending < 0 || pending > client.totalSessions) return prev;
        updatedClient.sessionsCompleted = client.totalSessions - pending;
      } else if (field === 'pendingAmount') {
        const pending = Number(value);
        if (pending < 0 || pending > client.cost) return prev;
        updatedClient.amountPaid = client.cost - pending;
      }

      return { ...prev, [id]: updatedClient };
    });
  };

  const handleSave = async (id) => {
    try {
      const updatedClient = editedClients[id];
      if (!updatedClient) return;

      const payload = {
        sessionsCompleted: updatedClient.sessionsCompleted,
        amountPaid: updatedClient.amountPaid,
      };

      const res = await axios.put(`/api/bills/${id}`, payload);
      setClients((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      const copy = { ...editedClients };
      delete copy[id];
      setEditedClients(copy);

      toast.success('Client updated successfully!');
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  // Function to initiate delete via custom modal
  const handleDelete = (id) => {
    setClientIdToDelete(id);
    setShowConfirmModal(true);
  };

  // Function to confirm and execute delete
  const confirmDeleteAction = async () => {
    if (!clientIdToDelete) return; // Should not happen if modal is correctly triggered

    try {
      await axios.delete(`/api/bills/${clientIdToDelete}`);
      const updatedClients = clients.filter((c) => c._id !== clientIdToDelete);
      setClients(updatedClients);
      const copy = { ...editedClients };
      delete copy[clientIdToDelete];
      setEditedClients(copy);
      toast.success('Client deleted successfully!');
      // If deleting the last item on the current page, go back a page if possible
      const lastPage = Math.ceil((updatedClients.length) / ITEMS_PER_PAGE);
      if (currentPage > lastPage && lastPage > 0) setCurrentPage(lastPage);
      else if (lastPage === 0) setCurrentPage(1); // If no items left, go to page 1
    } catch (err) {
      toast.error('Failed to delete client');
    } finally {
      setShowConfirmModal(false);
      setClientIdToDelete(null);
    }
  };

  // Function to cancel delete action
  const cancelDeleteAction = () => {
    setShowConfirmModal(false);
    setClientIdToDelete(null);
  };

  if (loading)
    return (
      <p className="text-center mt-12 text-indigo-700 font-medium">Loading clients...</p>
    );
  if (error)
    return <p className="text-center mt-12 text-red-600">{error}</p>;

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.services.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentClients = filteredClients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-indigo-50 to-indigo-100 px-4 py-10 sm:px-8">
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-800 mb-6">Client Details</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative flex items-center group w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by client name or service..."
            className="w-full pl-10 pr-10 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-800 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page to 1 on new search
            }}
          />
          {/* Search Icon */}
          <svg className="absolute left-3 w-5 h-5 text-indigo-500 group-focus-within:text-indigo-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-3 p-1 rounded-full text-indigo-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-[800px] w-full text-sm text-gray-800">
          <thead className="bg-indigo-700 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Service</th>
              <th className="px-4 py-4 text-center">Total</th>
              <th className="px-4 py-4 text-center">Pending Seatings</th> {/* Clarified header */}
              <th className="px-4 py-4 text-center">Cost (₹)</th>
              <th className="px-4 py-4 text-center">Pending Amount (₹)</th> {/* Clarified header */}
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <UserGroupIcon className="h-10 w-10 mb-2 text-indigo-400" />
                    No clients found or matches your search.
                  </div>
                </td>
              </tr>
            ) : (
              currentClients.map((client, i) => {
                const { totalSessions = 0, sessionsCompleted = 0, cost = 0, amountPaid = 0 } = client;
                const pendingSeatings =
                  editedClients[client._id]?.sessionsCompleted !== undefined
                    ? totalSessions - editedClients[client._id].sessionsCompleted
                    : totalSessions - sessionsCompleted;

                const pendingAmount =
                  editedClients[client._id]?.amountPaid !== undefined
                    ? cost - editedClients[client._id].amountPaid
                    : cost - amountPaid;

                return (
                  <tr
                    key={client._id}
                    className={`border-b ${
                      i % 2 === 0 ? 'bg-indigo-50' : 'bg-white'
                    } hover:bg-indigo-100`}
                  >
                    <td className="px-6 py-4 font-medium capitalize">{client.clientName || 'N/A'}</td>
                    <td className="px-6 py-4 capitalize">{client.services || 'N/A'}</td>
                    <td className="px-4 py-4 text-center">{totalSessions}</td>

                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        value={pendingSeatings}
                        onChange={(e) => handleChange(client._id, 'pendingSeatings', e.target.value)}
                        min={0}
                        max={totalSessions}
                        className="w-20 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-indigo-400"
                      />
                    </td>

                    <td className="px-4 py-4 text-center font-semibold text-green-700">₹ {cost}</td>

                    <td className="px-4 py-4 text-center">
                      <input
                        type="number"
                        value={pendingAmount}
                        onChange={(e) => handleChange(client._id, 'pendingAmount', e.target.value)}
                        min={0}
                        max={cost}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-center focus:ring-2 focus:ring-indigo-400"
                      />
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {editedClients[client._id] && (
                          <button
                            onClick={() => handleSave(client._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-medium"
                          >
                            Save
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  pageNum === currentPage
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-indigo-600 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this client? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDeleteAction}
                className="bg-gray-300 px-5 py-2 rounded-md hover:bg-gray-400 text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
