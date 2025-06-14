import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { PencilSquareIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline'; // Import Heroicons

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 10;

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // States for custom delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [staffToDeleteId, setStaffToDeleteId] = useState(null);

  // Validation errors object
  const [errors, setErrors] = useState({});

  // Helper to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      // Changed to relative URL /api/staff
      const res = await axios.get('/api/staff');
      setStaffList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setErrors({}); // Clear previous errors when opening the form
    setShowEditForm(true);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingStaff(null);
    setErrors({}); // Clear errors when closing the form
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
      case 'role':
      case 'qualification':
        if (!/^[A-Za-z.\s]+$/.test(value.trim())) {
          return 'Only alphabets, spaces, and dot (.) allowed';
        }
        if (!value.trim()) {
          return 'This field is required';
        }
        break;

      case 'phone':
        if (!/^\+91\d{10}$/.test(value)) {
          return 'Phone must start with +91 and be followed by 10 digits';
        }
        break;

      case 'experience':
        if (!/^\d+$/.test(value) || Number(value) <= 0) {
          return `Enter a valid positive experience`;
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
      // Skip salary validation as it's no longer a field
      if (key === 'salary') return;
      const errorMsg = validateField(key, val);
      if (errorMsg) newErrors[key] = errorMsg;
    });
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update field value
    setEditingStaff((prev) => ({ ...prev, [name]: value }));

    // Validate current field live
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    // Create a copy of editingStaff and remove the salary field before validation and sending
    const staffDataToProcess = { ...editingStaff };
    delete staffDataToProcess.salary;

    const validationErrors = validateAllFields(staffDataToProcess);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    try {
      // Changed to relative URL /api/staff/
      const res = await axios.put(`/api/staff/${editingStaff._id}`, staffDataToProcess);
      setStaffList((prev) =>
        prev.map((staff) => (staff._id === editingStaff._id ? res.data : staff))
      );
      toast.success('Staff updated successfully');
      closeEditForm();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update staff');
    }
  };

  // Function to initiate delete via custom modal
  const handleDelete = (id) => {
    setStaffToDeleteId(id);
    setShowConfirmModal(true);
  };

  // Function to confirm and execute delete
  const confirmDeleteAction = async () => {
    if (!staffToDeleteId) return; // Should not happen if modal is correctly triggered

    try {
      // Changed to relative URL /api/staff/
      await axios.delete(`/api/staff/${staffToDeleteId}`);
      setStaffList((prev) => prev.filter((staff) => staff._id !== staffToDeleteId));
      toast.success('Staff deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete staff');
    } finally {
      setShowConfirmModal(false);
      setStaffToDeleteId(null);
    }
  };

  // Function to cancel delete action
  const cancelDeleteAction = () => {
    setShowConfirmModal(false);
    setStaffToDeleteId(null);
  };

  const formatMobile = (mobile) => {
    // Assuming mobile format is +91 followed by 10 digits
    if (mobile && mobile.startsWith('+91') && mobile.length === 13) {
      const number = mobile.substring(3); // Get the 10 digits
      return `+91 ${number.replace(/(\d{5})(\d{5})/, "$1 $2")}`;
    }
    return mobile; // Return as is if not in expected format
  };

  // Filter staff based on search term
  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);
  const startIdx = (currentPage - 1) * staffPerPage;
  const currentStaff = filteredStaff.slice(startIdx, startIdx + staffPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 p-6 sm:p-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-800 mb-8 drop-shadow-md">
          Staff Management
        </h1>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mb-6 items-center">
          <button
            onClick={() => window.location.assign('/add-staff')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Add New Staff
          </button>
          {/* Search Bar */}
          <div className="relative flex items-center group w-full sm:w-1/3">
            <input
              type="text"
              placeholder="Search staff by name or role..."
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
            onClick={() => window.location.assign('/stafftargets')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Assign and Edit Targets
          </button>
        </div>

        <div className="overflow-auto rounded-xl shadow-lg">
          <table className="w-full min-w-[1100px] bg-white text-sm text-left">
            <thead className="bg-indigo-700 text-white">
              <tr>
                {/* Applied text-center to all table headers */}
                {['S.No', 'Name', 'Role', 'Phone', 'Experience', 'Qualification', 'Actions'].map((head, i) => (
                  <th key={i} className="py-3 px-4 border-r border-indigo-600 text-center">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500">
                    Loading staff data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-red-600">
                    {error}
                  </td>
                </tr>
              ) : currentStaff.length > 0 ? (
                currentStaff.map((staff, idx) => (
                  <tr
                    key={staff._id}
                    className={`border-b transition ${
                      idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'
                    } hover:bg-indigo-100`}
                  >
                    <td className="py-3 px-4 border-r text-center">{startIdx + idx + 1}</td>
                    {/* Capitalized Name and Role, applied text-center */}
                    <td className="py-3 px-4 border-r text-center">{capitalizeFirstLetter(staff.name)}</td>
                    <td className="py-3 px-4 border-r text-center">{capitalizeFirstLetter(staff.role)}</td>
                    <td className="py-3 px-4 border-r text-center">{formatMobile(staff.phone)}</td>
                    <td className="py-3 px-4 border-r text-center">{staff.experience} years</td>
                    <td className="py-3 px-4 border-r text-center">{capitalizeFirstLetter(staff.qualification)}</td>
                    <td className="py-3 px-4 text-center"> {/* Applied text-center to the Actions cell */}
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-md shadow-sm flex items-center gap-1 justify-center"
                        >
                          <PencilSquareIcon className="h-4 w-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(staff._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow-sm flex items-center gap-1 justify-center"
                        >
                          <TrashIcon className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    <div className="flex flex-col items-center">
                      <UserGroupIcon className="h-10 w-10 mb-2 text-indigo-400" />
                      No staff members found or matches your search.
                    </div>
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
        {showEditForm && editingStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <form
              onSubmit={handleUpdate}
              className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl space-y-5 overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-indigo-700 mb-4">Edit Staff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/** Name */}
                <div>
                  <input
                    type="text"
                    name="name"
                    value={editingStaff.name || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Full Name"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/** Role */}
                <div>
                  <input
                    type="text"
                    name="role"
                    value={editingStaff.role || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Role"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.role && (
                    <p className="text-red-600 text-xs mt-1">{errors.role}</p>
                  )}
                </div>

                {/** Phone */}
                <div>
                  <input
                    type="text"
                    name="phone"
                    value={editingStaff.phone || '+91'}
                    onChange={(e) => {
                      let input = e.target.value.replace(/[^\d]/g, '');
                      if (input.length > 0 && !input.startsWith('91')) {
                        input = '91' + input;
                      }
                      input = input.slice(0, 12);
                      handleInputChange({ target: { name: 'phone', value: '+' + input } });
                    }}
                    placeholder="+911234567890"
                    maxLength={13}
                    required
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
                    value={editingStaff.experience || ''}
                    onChange={handleInputChange}
                    required
                    placeholder="Experience (years)"
                    className={`px-4 py-2 border rounded-md w-full ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min={1}
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
                    value={editingStaff.qualification || ''}
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
              </div>

              <div className="flex justify-end gap-6 mt-4">
                <button
                  type="button"
                  onClick={closeEditForm}
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
              <p className="text-gray-600 mb-6">Are you sure you want to delete this staff member? This action cannot be undone.</p>
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

export default Staff;
