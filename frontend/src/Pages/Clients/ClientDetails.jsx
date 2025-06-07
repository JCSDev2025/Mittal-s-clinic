import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 10;

const ClientDetails = () => {
  const [clients, setClients] = useState([]);
  const [editedClients, setEditedClients] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('/api/bills');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      await axios.delete(`/api/bills/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
      const copy = { ...editedClients };
      delete copy[id];
      setEditedClients(copy);
      toast.success('Client deleted successfully!');
      // If deleting the last item on the current page, go back a page if possible
      const lastPage = Math.ceil((clients.length - 1) / ITEMS_PER_PAGE);
      if (currentPage > lastPage) setCurrentPage(lastPage);
    } catch (err) {
      toast.error('Failed to delete client');
    }
  };

  if (loading)
    return (
      <p className="text-center mt-12 text-indigo-700 font-medium">Loading clients...</p>
    );
  if (error)
    return <p className="text-center mt-12 text-red-600">{error}</p>;

  // Calculate pagination
  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentClients = clients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-indigo-50 to-indigo-100 px-4 py-10 sm:px-8">
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-800 mb-10">Client Details</h1>

      <div className="overflow-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-[800px] w-full text-sm text-gray-800">
          <thead className="bg-indigo-700 text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Service</th>
              <th className="px-4 py-4 text-center">Total</th>
              <th className="px-4 py-4 text-center">Pending</th>
              <th className="px-4 py-4 text-center">Amount</th>
              <th className="px-4 py-4 text-center">Pending</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No clients found.
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
    </div>
  );
};

export default ClientDetails;
