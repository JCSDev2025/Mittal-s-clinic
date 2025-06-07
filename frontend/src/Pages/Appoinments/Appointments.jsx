import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ITEMS_PER_PAGE = 10;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this appointment?');
    if (confirm) {
      try {
        await axios.delete(`/api/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowEditForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/appointments/${editingAppointment._id}`, editingAppointment);
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === editingAppointment._id ? response.data : appt))
      );
      setShowEditForm(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = appointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-teal-50 to-teal-100 p-6 sm:p-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-teal-900 drop-shadow-md text-center">
        Appointments List
      </h1>

      <button
        onClick={() => (window.location.href = '/add-appointment')}
        className="mb-8 px-8 py-3 bg-teal-700 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-800 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400"
      >
        Add New Appointment
      </button>

      <div className="w-full max-w-7xl overflow-x-auto rounded-lg shadow-xl bg-white border border-gray-200">
        <table className="w-full min-w-[900px] text-left text-gray-700">
          <thead className="bg-teal-700 text-white uppercase text-sm tracking-wide select-none">
            <tr>
              <th className="px-5 py-4 border-r border-teal-600">S.No</th>
              <th className="px-5 py-4 border-r border-teal-600">Client Name</th>
              <th className="px-5 py-4 border-r border-teal-600">Age</th>
              <th className="px-5 py-4 border-r border-teal-600">Gender</th>
              <th className="px-5 py-4 border-r border-teal-600">Contact</th>
              <th className="px-5 py-4 border-r border-teal-600">Service</th>
              <th className="px-5 py-4 border-r border-teal-600">Doctor Name</th>
              <th className="px-5 py-4 border-r border-teal-600">Date</th>
              <th className="px-5 py-4 border-r border-teal-600">Time</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? (
              currentAppointments.map((appt, idx) => (
                <tr
                  key={appt._id}
                  className={`border-b border-gray-200 ${
                    idx % 2 === 0 ? 'bg-teal-50' : 'bg-white'
                  } hover:bg-teal-100 transition-colors duration-300`}
                >
                  <td className="px-5 py-3 border-r border-teal-100 font-semibold">{startIndex + idx + 1}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.clientName}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.age}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.gender}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.contact}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.service}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.doctorName}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.date}</td>
                  <td className="px-5 py-3 border-r border-teal-100">{appt.time}</td>
                  <td className="px-5 py-3 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(appt)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-md text-sm shadow-md transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm shadow-md transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-8 text-gray-500 italic select-none">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex justify-center mt-6 space-x-2 select-none"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition ${
              currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            aria-label="Previous Page"
          >
            &laquo;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-1 rounded-md border border-teal-600 hover:bg-teal-600 hover:text-white transition ${
                currentPage === i + 1
                  ? 'bg-teal-600 text-white cursor-default'
                  : 'text-teal-700'
              }`}
              aria-current={currentPage === i + 1 ? 'page' : undefined}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white transition ${
              currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            aria-label="Next Page"
          >
            &raquo;
          </button>
        </nav>
      )}

      {/* Edit Modal */}
      {showEditForm && editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6"
          >
            <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">Edit Appointment</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="clientName"
                value={editingAppointment.clientName || ''}
                onChange={handleInputChange}
                required
                placeholder="Client Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="number"
                name="age"
                value={editingAppointment.age || ''}
                onChange={handleInputChange}
                required
                placeholder="Age"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                name="gender"
                value={editingAppointment.gender || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                name="contact"
                value={editingAppointment.contact || ''}
                onChange={handleInputChange}
                placeholder="Contact"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <input
              type="text"
              name="service"
              value={editingAppointment.service || ''}
              onChange={handleInputChange}
              placeholder="Service"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <input
              type="text"
              name="doctorName"
              value={editingAppointment.doctorName || ''}
              onChange={handleInputChange}
              placeholder="Doctor Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                value={editingAppointment.date || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="time"
                name="time"
                value={editingAppointment.time || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingAppointment(null);
                }}
                className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition"
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

export default Appointments;
