import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const Services = ({ services, setServices }) => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?');
    if (confirmDelete) {
      const updatedServices = services.filter((service) => service.id !== id);
      setServices(updatedServices);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-service/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-900 drop-shadow-md">Services List</h1>

      <button
        onClick={() => navigate('/add-service')}
        className="mb-8 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 active:scale-95 transition transform flex items-center gap-2"
      >
        Add New Service
      </button>

      <div className="w-full max-w-7xl overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3 border-r border-indigo-500">S.no</th>
              <th className="px-4 py-3 border-r border-indigo-500">Service Name</th>
              <th className="px-4 py-3 border-r border-indigo-500">Category</th>
              <th className="px-4 py-3 border-r border-indigo-500">Description</th>
              <th className="px-4 py-3 border-r border-indigo-500">Price (₹)</th>
              <th className="px-4 py-3 border-r border-indigo-500">Sessions</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service, idx) => (
                <tr
                  key={service.id}
                  className={`border-b border-indigo-100 ${
                    idx % 2 === 0 ? 'bg-indigo-50' : ''
                  } hover:bg-indigo-100 transition`}
                >
                  <td className="px-4 py-4 border-r border-indigo-200 font-medium">{idx + 1}</td>
                  <td className="px-4 py-4 border-r border-indigo-200">{service.name}</td>
                  <td className="px-4 py-4 border-r border-indigo-200">{service.category}</td>
                  <td className="px-4 py-4 border-r border-indigo-200">{service.description}</td>
                  <td className="px-4 py-4 border-r border-indigo-200">
                    {service.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 border-r border-indigo-200">{service.sessions}</td>
                  <td className="px-4 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(service.id)}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label={`Edit ${service.name}`}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete ${service.name}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No services available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
