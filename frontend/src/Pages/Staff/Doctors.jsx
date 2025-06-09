import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;

  // Validation errors object
  const [errors, setErrors] = useState({});

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/doctors/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      toast.success('Doctor deleted successfully');
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      toast.error('Failed to delete doctor');
    }
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

      case 'salary':
        if (!/^\d+$/.test(value) || Number(value) <= 0) {
          return 'Enter a valid positive salary';
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

    const validationErrors = validateAllFields(editingDoctor);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    try {
      const response = await axios.put(`/api/doctors/${editingDoctor._id}`, editingDoctor);
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

  // Pagination logic
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  const startIdx = (currentPage - 1) * doctorsPerPage;
  const currentDoctors = doctors.slice(startIdx, startIdx + doctorsPerPage);

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
          <button
            onClick={() => window.location.assign('/targets')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            View Targets
          </button>
        </div>

        <div className="overflow-auto rounded-xl shadow-lg">
          <table className="w-full min-w-[1100px] bg-white text-sm text-left">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="py-3 px-4 border-r border-indigo-600">S.No</th>
                <th className="py-3 px-4 border-r border-indigo-600">Name</th>
                <th className="py-3 px-4 border-r border-indigo-600">Specialty</th>
                <th className="py-3 px-4 border-r border-indigo-600">Email</th>
                <th className="py-3 px-4 border-r border-indigo-600">Phone</th>
                <th className="py-3 px-4 border-r border-indigo-600">Experience</th>
                <th className="py-3 px-4 border-r border-indigo-600">Qualification</th>
                <th className="py-3 px-4 border-r border-indigo-600">Salary (₹)</th>
                <th className="py-3 px-4 border-r border-indigo-600">Availability</th>
                <th className="py-3 px-4">Actions</th>
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
                    <td className="py-3 px-4 border-r">{startIdx + idx + 1}</td>
                    <td className="py-3 px-4 border-r">{doctor.name}</td>
                    <td className="py-3 px-4 border-r">{doctor.specialty}</td>
                    <td className="py-3 px-4 border-r">{doctor.email}</td>
                    <td className="py-3 px-4 border-r">{doctor.phone}</td>
                    <td className="py-3 px-4 border-r">{doctor.experience}</td>
                    <td className="py-3 px-4 border-r">{doctor.qualification}</td>
                    <td className="py-3 px-4 border-r">₹{doctor.salary}</td>
                    <td className="py-3 px-4 border-r">{doctor.availability}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row gap-2">
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
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    No doctors available.
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

                {/** Salary */}
                <div>
                  <input
                    type="number"
                    name="salary"
                    value={editingDoctor.salary || ''}
                    onChange={handleInputChange}
                    required
                    min={1}
                    placeholder="Salary (₹)"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.salary ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.salary && (
                    <p className="text-red-600 text-xs mt-1">{errors.salary}</p>
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
      </div>
    </div>
  );
};

export default Doctors;
