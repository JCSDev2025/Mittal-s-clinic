import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Clients = ({ clients, setClients }) => {
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const handleDelete = (id) => {
    const updatedClients = clients.filter((client) => client.id !== id);
    setClients(updatedClients);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowEditForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedClients = clients.map((p) =>
      p.id === editingClient.id ? editingClient : p
    );
    setClients(updatedClients);
    setShowEditForm(false);
    setEditingClient(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-emerald-900 drop-shadow-md">Clients List</h1>

      {/* Action Buttons */}
      <div className="mb-8 flex space-x-4">
        <button
          onClick={() => navigate('/add-client')}
          className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 active:scale-95 transition transform"
        >
          Add New Client
        </button>
        <button
          onClick={() => navigate('/client-details')}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition transform"
        >
          Client Details
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-6 py-3 border-r border-emerald-500">S.no</th>
              <th className="px-6 py-3 border-r border-emerald-500">Name</th>
              <th className="px-6 py-3 border-r border-emerald-500">Age</th>
              <th className="px-6 py-3 border-r border-emerald-500">Mobile</th>
              <th className="px-6 py-3 border-r border-emerald-500">Address</th>
              <th className="px-6 py-3 border-r border-emerald-500">DOB</th>
              <th className="px-6 py-3 border-r border-emerald-500">Gender</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client, idx) => (
                <tr
                  key={client.id}
                  className={`border-b border-emerald-100 ${
                    idx % 2 === 0 ? 'bg-emerald-50' : ''
                  } hover:bg-emerald-100 transition`}
                >
                  <td className="px-6 py-4 border-r border-emerald-200 font-medium">{client.id}</td>
                  <td className="px-6 py-4 border-r border-emerald-200">{client.name}</td>
                  <td className="px-6 py-4 border-r border-emerald-200">{client.age}</td>
                  <td className="px-6 py-4 border-r border-emerald-200">{client.mobile}</td>
                  <td className="px-6 py-4 border-r border-emerald-200">{client.address}</td>
                  <td className="px-6 py-4 border-r border-emerald-200">{client.dob}</td>
                  <td className="px-6 py-4 border-r border-emerald-200">{client.gender}</td>
                  <td className="px-6 py-4 flex space-x-3 justify-center">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-sm px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-sm px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No clients available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditForm && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4"
          >
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">Edit Client</h2>

            <input
              type="text"
              name="name"
              value={editingClient.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              required
            />
            <input
              type="number"
              name="age"
              value={editingClient.age}
              onChange={handleInputChange}
              placeholder="Age"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              required
            />
            <input
              type="text"
              name="mobile"
              value={editingClient.mobile}
              onChange={handleInputChange}
              placeholder="Mobile"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              required
            />
            <input
              type="text"
              name="address"
              value={editingClient.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              required
            />
            <input
              type="date"
              name="dob"
              value={editingClient.dob}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              required
            />
            <select
              name="gender"
              value={editingClient.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-emerald-400"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingClient(null);
                }}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
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
