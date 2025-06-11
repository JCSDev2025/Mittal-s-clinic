import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css'; // Removed to prevent compilation errors

const ITEMS_PER_PAGE = 10;

const Appointments = () => {
  // Using window.location.href for navigation as react-router-dom is not in the provided context
  // If react-router-dom is available in your full project, you can use `useNavigate`
  // const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [errors, setErrors] = useState({});

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // States for custom delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToDeleteId, setAppointmentToDeleteId] = useState(null);


  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    }
  };

  // Function to initiate delete via custom modal
  const handleDelete = (id) => {
    setAppointmentToDeleteId(id);
    setShowConfirmModal(true);
  };

  // Function to confirm and execute delete
  const confirmDeleteAction = async () => {
    if (!appointmentToDeleteId) return; // Should not happen if modal is correctly triggered

    try {
      await axios.delete(`/api/appointments/${appointmentToDeleteId}`);
      toast.success('Appointment deleted successfully');
      fetchAppointments(); // Re-fetch appointments after deletion
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    } finally {
      setShowConfirmModal(false);
      setAppointmentToDeleteId(null);
    }
  };

  // Function to cancel delete action
  const cancelDeleteAction = () => {
    setShowConfirmModal(false);
    setAppointmentToDeleteId(null);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setErrors({});
    setShowEditForm(true);
  };

  // Validation helper functions
  const validate = (data) => {
    const newErrors = {};

    // Only letters, spaces, dots, commas allowed
    const nameRegex = /^[a-zA-Z.,\s]+$/;

    // Service allows alphabets, numbers, ., -, comma, spaces
    const serviceRegex = /^[a-zA-Z0-9.,\-\s]+$/;

    // Contact: exactly 10 digits (allow +91 prefix but validate only digits after it)
    const contactDigits = data.contact ? data.contact.replace(/^\+91/, '') : '';

    if (!data.clientName || !nameRegex.test(data.clientName.trim())) {
      newErrors.clientName = "Client Name must contain only letters, spaces, dots, commas.";
    }

    if (!data.doctorName || !nameRegex.test(data.doctorName.trim())) {
      newErrors.doctorName = "Doctor Name must contain only letters, spaces, dots, commas.";
    }

    if (!data.age || isNaN(data.age) || Number(data.age) <= 0 || !Number.isInteger(Number(data.age))) {
      newErrors.age = "Age must be a positive integer.";
    }

    if (!data.contact || contactDigits.length !== 10 || !/^\d{10}$/.test(contactDigits)) {
      newErrors.contact = "Contact must be exactly 10 digits (numbers only) after +91.";
    }

    if (!data.service || !serviceRegex.test(data.service.trim())) {
      newErrors.service = "Service can contain only letters, numbers, dots, commas, hyphens, and spaces.";
    }

    // Validate required fields generally
    ['gender', 'date', 'time'].forEach((field) => {
      if (!data[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingAppointment) return;

    const validationErrors = validate(editingAppointment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix validation errors before submitting');
      return;
    }

    try {
      const response = await axios.put(`/api/appointments/${editingAppointment._id}`, editingAppointment);
      setAppointments((prev) =>
        prev.map((appt) => (appt._id === editingAppointment._id ? response.data : appt))
      );
      setShowEditForm(false);
      setEditingAppointment(null);
      setErrors({});
      toast.success('Appointment updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update appointment');
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(appt =>
    appt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAppointments = filteredAppointments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-white via-teal-50 to-teal-100 p-6 sm:p-10 flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-4xl font-extrabold mb-8 text-teal-900 drop-shadow-md text-center">
        Appointments List
      </h1>

      <div className="mb-8 w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={() => (window.location.href = '/add-appointment')}
          className="px-8 py-3 bg-teal-700 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-800 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400"
        >
          Add New Appointment
        </button>

        {/* Search Bar */}
        <div className="relative flex items-center group w-full sm:w-1/4">
          <input
            type="text"
            placeholder="Search by client or doctor name..."
            className="w-full pl-10 pr-10 py-2 border border-teal-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-teal-800 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page to 1 on new search
            }}
          />
          {/* Search Icon */}
          <svg className="absolute left-3 w-5 h-5 text-teal-500 group-focus-within:text-teal-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-3 p-1 rounded-full text-teal-500 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

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
                  No appointments found or matches your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex justify-center mt-6 space-x-2 select-none">
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
                currentPage === i + 1 ? 'bg-teal-600 text-white cursor-default' : 'text-teal-700'
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
            className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full space-y-6 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">Edit Appointment</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="clientName"
                  value={editingAppointment.clientName || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Client Name"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    errors.clientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
              </div>

              <div>
                <input
                  type="number"
                  name="age"
                  value={editingAppointment.age || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Age"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <select
                  name="gender"
                  value={editingAppointment.gender || ''}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="contact"
                  value={editingAppointment.contact || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="+91XXXXXXXXXX"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
              </div>
            </div>

            <div>
              <input
                type="text"
                name="service"
                value={editingAppointment.service || ''}
                onChange={handleInputChange}
                required
                placeholder="Service"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  errors.service ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
            </div>

            <div>
              <input
                type="text"
                name="doctorName"
                value={editingAppointment.doctorName || ''}
                onChange={handleInputChange}
                required
                placeholder="Doctor Name"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  errors.doctorName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.doctorName && <p className="text-red-500 text-sm mt-1">{errors.doctorName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="date"
                  name="date"
                  value={editingAppointment.date || ''}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              <div>
                <input
                  type="time"
                  name="time"
                  value={editingAppointment.time || ''}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingAppointment(null);
                  setErrors({});
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

      {/* Custom Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this appointment? This action cannot be undone.</p>
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

export default Appointments;
