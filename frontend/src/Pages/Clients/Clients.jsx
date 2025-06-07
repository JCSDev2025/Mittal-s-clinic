import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/clients/${id}`);
      setClients(clients.filter((client) => client._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowEditForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/clients/${editingClient._id}`, editingClient);
      const updatedClients = clients.map((c) =>
        c._id === editingClient._id ? response.data : c
      );
      setClients(updatedClients);
      setShowEditForm(false);
      setEditingClient(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN');
  const formatMobile = (mobile) => mobile.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const paginatedClients = clients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-emerald-900">Clients List</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4 w-full max-w-5xl justify-center">
        <button
          onClick={() => navigate('/add-client')}
          className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-md shadow hover:bg-emerald-700 transition"
        >
          Add New Client
        </button>
        <button
          onClick={() => navigate('/client-details')}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition"
        >
          Client Details
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-lg bg-white shadow max-w-6xl">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-emerald-600 text-white">
            <tr>
              {['S.No', 'Name', 'Age', 'Mobile', 'Address', 'DOB', 'Gender', 'Actions'].map((head, i) => (
                <th key={i} className="px-4 py-3 border-r last:border-r-0 whitespace-nowrap text-sm md:text-base">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedClients.length > 0 ? (
              paginatedClients.map((client, idx) => (
                <tr
                  key={client._id}
                  className={`transition hover:bg-emerald-50 ${idx % 2 ? 'bg-white' : 'bg-emerald-50'}`}
                >
                  <td className="px-4 py-3 text-center">{indexOfFirstClient + idx + 1}</td>
                  <td className="px-4 py-3 capitalize">{client.name}</td>
                  <td className="px-4 py-3 text-center">{client.age}</td>
                  <td className="px-4 py-3 text-center">{formatMobile(client.mobile)}</td>
                  <td className="px-4 py-3 capitalize">{client.address}</td>
                  <td className="px-4 py-3 text-center">{formatDate(client.dob)}</td>
                  <td className="px-4 py-3 text-center">{client.gender}</td>
                  <td className="px-4 py-3 text-center flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                    >
                      <PencilSquareIcon className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                    >
                      <TrashIcon className="h-4 w-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  <div className="flex flex-col items-center">
                    <UserGroupIcon className="h-10 w-10 mb-2 text-emerald-400" />
                    No clients found.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx + 1)}
              className={`px-4 py-2 rounded-md border ${
                currentPage === idx + 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-emerald-600 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
          <form onSubmit={handleUpdate} className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl space-y-5">
            <h2 className="text-xl md:text-2xl font-semibold text-emerald-700">Edit Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" value={editingClient.name} onChange={handleInputChange} required placeholder="Name" className="px-4 py-2 border rounded-md" />
              <input type="number" name="age" value={editingClient.age} onChange={handleInputChange} required placeholder="Age" className="px-4 py-2 border rounded-md" />
              <input type="text" name="mobile" value={editingClient.mobile} onChange={handleInputChange} required placeholder="Mobile" className="px-4 py-2 border rounded-md" />
              <input type="text" name="address" value={editingClient.address} onChange={handleInputChange} placeholder="Address" className="px-4 py-2 border rounded-md" />
              <input type="date" name="dob" value={editingClient.dob} onChange={handleInputChange} required className="px-4 py-2 border rounded-md col-span-1 md:col-span-2" />
              <select name="gender" value={editingClient.gender} onChange={handleInputChange} className="px-4 py-2 border rounded-md col-span-1 md:col-span-2" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => { setShowEditForm(false); setEditingClient(null); }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 text-white px-5 py-2 rounded hover:bg-emerald-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Clients;
