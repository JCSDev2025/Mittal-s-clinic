import React, { useState } from 'react';

const ClientDetails = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Mounika',
      service: 'Facial Treatment',
      totalSeatings: 10,
      pendingSeatings: 2,
      pendingAmount: 1000,
      totalAmount: 5000,
    },
    {
      id: 2,
      name: 'Rahul',
      service: 'Hair Spa',
      totalSeatings: 5,
      pendingSeatings: 1,
      pendingAmount: 400,
      totalAmount: 2500,
    },
    {
      id: 3,
      name: 'Anjali',
      service: 'Pedicure',
      totalSeatings: 4,
      pendingSeatings: 0,
      pendingAmount: 0,
      totalAmount: 1800,
    },
    {
      id: 4,
      name: 'Vikram',
      service: 'Massage Therapy',
      totalSeatings: 8,
      pendingSeatings: 3,
      pendingAmount: 1200,
      totalAmount: 4500,
    },
    {
      id: 5,
      name: 'Neha',
      service: 'Hair Color',
      totalSeatings: 6,
      pendingSeatings: 1,
      pendingAmount: 600,
      totalAmount: 3000,
    },
  ]);

  const [editedClients, setEditedClients] = useState({});

  const handleChange = (id, field, value) => {
    setEditedClients((prev) => ({
      ...prev,
      [id]: {
        ...clients.find((c) => c.id === id),
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (id) => {
    const updated = clients.map((client) =>
      client.id === id ? { ...client, ...editedClients[id] } : client
    );
    setClients(updated);
    setEditedClients((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">Client Details</h1>

      <div className="overflow-x-auto shadow-2xl rounded-lg bg-white p-4">
        <table className="min-w-full table-auto border-collapse text-left">
          <thead className="bg-indigo-700 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-4 border-r">Client Name</th>
              <th className="px-6 py-4 border-r">Service Name</th>
              <th className="px-6 py-4 border-r">Total Seatings</th>
              <th className="px-6 py-4 border-r">Pending Seatings</th>
              <th className="px-6 py-4 border-r">Total Amount (₹)</th>
              <th className="px-6 py-4 border-r">Pending Amount (₹)</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr
                key={client.id}
                className={`border-b text-sm ${
                  index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'
                } hover:bg-indigo-100 transition`}
              >
                <td className="px-6 py-4 border-r font-medium">{client.name}</td>
                <td className="px-6 py-4 border-r">{client.service}</td>
                <td className="px-6 py-4 border-r text-center">{client.totalSeatings}</td>

                <td className="px-6 py-4 border-r">
                  <input
                    type="number"
                    value={editedClients[client.id]?.pendingSeatings ?? client.pendingSeatings}
                    onChange={(e) =>
                      handleChange(client.id, 'pendingSeatings', e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-400"
                  />
                </td>

                <td className="px-6 py-4 border-r text-center font-semibold text-green-700">
                  ₹ {client.totalAmount}
                </td>

                <td className="px-6 py-4 border-r">
                  <input
                    type="number"
                    value={editedClients[client.id]?.pendingAmount ?? client.pendingAmount}
                    onChange={(e) =>
                      handleChange(client.id, 'pendingAmount', e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-400"
                  />
                </td>

                <td className="px-6 py-4">
                  {editedClients[client.id] && (
                    <button
                      onClick={() => handleSave(client.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                    >
                      Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientDetails;
