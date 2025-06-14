import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // States for custom delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [doctorToDeleteId, setDoctorToDeleteId] = useState(null);

  // Validation errors object
  const [errors, setErrors] = useState({});

  // Helper to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      const result = response.data;
      if (Array.isArray(result)) {
        setDoctors(result);
      } else {
        console.error('Unexpected response format:', result);
        setDoctors([]);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setDoctors([]);
    }
  };

  const handleDelete = (id) => {
    setDoctorToDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteAction = async () => {
    if (!doctorToDeleteId) return; // Should not happen if modal is correctly triggered

    try {
      await axios.delete(`/api/doctors/${doctorToDeleteId}`);
      setDoctors((prev) => prev.filter((doc) => doc._id !== doctorToDeleteId));
      toast.success('Doctor deleted successfully');
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      toast.error('Failed to delete doctor');
    } finally {
      setShowConfirmModal(false);
      setDoctorToDeleteId(null);
    }
  };

  const cancelDeleteAction = () => {
    setShowConfirmModal(false);
    setDoctorToDeleteId(null);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setErrors({});
    setShowEditForm(true);
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
      case 'specialty':
      case 'qualification':
        if (!/^[A-Za-z .]+$/.test(value.trim())) {
          return 'Only alphabets, spaces, and dot (.) allowed';
        }
        if (!value.trim()) {
          return 'This field is required';
        }
        break;

      case 'experience':
        if (!/^\d+$/.test(value) || Number(value) <= 0) {
          return 'Enter a valid positive number';
        }
        break;

      case 'phone':
        if (!/^\+91\d{10}$/.test(value)) {
          return 'Phone must start with +91 and followed by 10 digits';
        }
        break;

      case 'availability':
        if (!/^\d{1,2}-\d{1,2}$/.test(value)) {
          return 'Availability must be in format "9-5", "10-6" etc.';
        }
        break;

      case 'email':
        // basic email validation
        if (!/^\S+@\S+\.\S+$/.test(value.trim())) {
          return 'Enter a valid email';
        }
        break;

      default:
        return '';
    }
    return '';
  };

  const validateAllFields = (data) => {
    const newErrors = {};
    Object.entries(data).forEach(([key, val]) => {
      // Skip 'salary' in validation
      if (key === 'salary') return;
      const errorMsg = validateField(key, val);
      if (errorMsg) newErrors[key] = errorMsg;
    });
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update field value
    setEditingDoctor((prev) => ({ ...prev, [name]: value }));

    // Validate current field live
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingDoctor) return;

    // Create a copy of editingDoctor and remove the salary field before validation
    const doctorDataToValidate = { ...editingDoctor };
    delete doctorDataToValidate.salary;

    const validationErrors = validateAllFields(doctorDataToValidate);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    try {
      // Create a copy of editingDoctor and remove the salary field before sending to API
      const doctorDataToSend = { ...editingDoctor };
      delete doctorDataToSend.salary;

      const response = await axios.put(`/api/doctors/${editingDoctor._id}`, doctorDataToSend);
      const updatedDoctors = doctors.map((doc) =>
        doc._id === editingDoctor._id ? response.data : doc
      );
      setDoctors(updatedDoctors);
      setShowEditForm(false);
      setEditingDoctor(null);
      toast.success('Doctor updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update doctor');
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIdx = (currentPage - 1) * doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(startIdx, startIdx + doctorsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 p-6 sm:p-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-800 mb-8 drop-shadow-md">
          Doctors Management
        </h1>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => window.location.assign('/add-doctor')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Add New Doctor
          </button>
          {/* Search Bar moved here */}
          <div className="relative flex items-center group w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search doctors by name or qualification..."
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
          <button
            onClick={() => window.location.assign('/targets')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Assign and Edit Targets
          </button>
        </div>


        <div className="overflow-auto rounded-xl shadow-lg">
          <table className="w-full min-w-[1100px] bg-white text-sm text-left">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">S.No</th>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">Name</th>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">Specialty</th>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">Email</th>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">Phone</th>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">Experience</th>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">Qualification</th>
                <th className="py-3 px-4 border-r border-indigo-600 text-center">Availability</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor, idx) => (
                  <tr
                    key={doctor._id}
                    className={`border-b transition ${
                      idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'
                    } hover:bg-indigo-100`}
                  >
                    <td className="py-3 px-4 border-r text-center">{startIdx + idx + 1}</td>
                    <td className="py-3 px-4 border-r text-center">{capitalizeFirstLetter(doctor.name)}</td>
                    <td className="py-3 px-4 border-r text-center">{capitalizeFirstLetter(doctor.specialty)}</td>
                    <td className="py-3 px-4 border-r text-center">{doctor.email}</td>
                    <td className="py-3 px-4 border-r text-center">{doctor.phone}</td>
                    <td className="py-3 px-4 border-r text-center">{doctor.experience}</td>
                    <td className="py-3 px-4 border-r text-center">{doctor.qualification}</td>
                    <td className="py-3 px-4 border-r text-center">{doctor.availability}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-md shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doctor._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No doctors available or matches your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => goToPage(idx + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === idx + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {showEditForm && editingDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <form
              onSubmit={handleUpdate}
              className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl space-y-5 overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-indigo-700 mb-4">Edit Doctor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/** Name */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editingDoctor.name || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Name"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/** Specialty */}
                <div>
                  <input
                    type="text"
                    name="specialty"
                    value={editingDoctor.specialty || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Specialty"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.specialty ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.specialty && (
                    <p className="text-red-600 text-xs mt-1">{errors.specialty}</p>
                  )}
                </div>

                {/** Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={editingDoctor.email || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Email"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/** Phone */}
                <div>
                  <input
                    type="text"
                    name="phone"
                    value={editingDoctor.phone || '+91'}
                    onChange={handleInputChange}
                    required
                    placeholder="Phone (e.g. +911234567890)"
                    maxLength={13}
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/** Experience */}
                <div>
                  <input
                    type="number"
                    name="experience"
                    value={editingDoctor.experience || ''}
                    onChange={handleInputChange}
                    required
                    min={1}
                    placeholder="Experience (years)"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.experience && (
                    <p className="text-red-600 text-xs mt-1">{errors.experience}</p>
                  )}
                </div>

                {/** Qualification */}
                <div>
                  <input
                    type="text"
                    name="qualification"
                    value={editingDoctor.qualification || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Qualification"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.qualification ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.qualification && (
                    <p className="text-red-600 text-xs mt-1">{errors.qualification}</p>
                  )}
                </div>

                {/** Availability */}
                <div>
                  <input
                    type="text"
                    name="availability"
                    value={editingDoctor.availability || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Availability (e.g. 9-5)"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.availability ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.availability && (
                    <p className="text-red-600 text-xs mt-1">{errors.availability}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingDoctor(null);
                    setErrors({});
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this doctor? This action cannot be undone.</p>
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
    </div>
  );
};

export default Doctors;