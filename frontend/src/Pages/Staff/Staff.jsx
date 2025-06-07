import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 10;

  // Edit modal states
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Fetch staff data from backend
  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:3000/api/staff');
      setStaffList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Open edit modal and load staff data
  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setShowEditForm(true);
  };

  // Close modal
  const closeEditForm = () => {
    setShowEditForm(false);
    setEditingStaff(null);
  };

  // Handle input change in edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff((prev) => ({ ...prev, [name]: value }));
  };

  // Update staff data
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/api/staff/${editingStaff._id}`, editingStaff);
      // Update staffList with updated staff info
      setStaffList((prev) =>
        prev.map((staff) => (staff._id === editingStaff._id ? res.data : staff))
      );
      closeEditForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update staff');
    }
  };

  // Delete staff member
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this staff member?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/staff/${id}`);
      setStaffList((prev) => prev.filter((staff) => staff._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete staff member');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(staffList.length / staffPerPage);
  const startIdx = (currentPage - 1) * staffPerPage;
  const currentStaff = staffList.slice(startIdx, startIdx + staffPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-800 mb-8 drop-shadow-md">
          Staff Management
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowEditForm(false) || setEditingStaff(null) || window.location.assign('/add-staff')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Add New Staff
          </button>
        </div>

        {loading ? (
          <p className="text-center text-indigo-700 font-semibold">Loading staff data...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : (
          <>
            <div className="overflow-auto rounded-xl shadow-lg">
              <table className="w-full min-w-[900px] bg-white text-sm text-left">
                <thead className="bg-indigo-700 text-white">
                  <tr>
                    <th className="py-3 px-4 border-r">S.No</th>
                    <th className="py-3 px-4 border-r">Name</th>
                    <th className="py-3 px-4 border-r">Role</th>
                    <th className="py-3 px-4 border-r">Phone</th>
                    <th className="py-3 px-4 border-r">Experience</th>
                    <th className="py-3 px-4 border-r">Qualification</th>
                    <th className="py-3 px-4 border-r">Salary (₹)</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStaff.length > 0 ? (
                    currentStaff.map((staff, idx) => (
                      <tr
                        key={staff._id}
                        className={`border-b transition ${
                          idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'
                        } hover:bg-indigo-100`}
                      >
                        <td className="py-3 px-4 border-r">{startIdx + idx + 1}</td>
                        <td className="py-3 px-4 border-r">{staff.name}</td>
                        <td className="py-3 px-4 border-r">{staff.role}</td>
                        <td className="py-3 px-4 border-r">{staff.phone}</td>
                        <td className="py-3 px-4 border-r">{staff.experience} years</td>
                        <td className="py-3 px-4 border-r">{staff.qualification}</td>
                        <td className="py-3 px-4 border-r">₹{staff.salary}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleEdit(staff)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-md shadow-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(staff._id)}
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
                      <td colSpan="8" className="text-center py-6 text-gray-500">
                        No staff members available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

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
          </>
        )}

        {/* Edit Modal */}
        {showEditForm && editingStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <form
              onSubmit={handleUpdate}
              className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl space-y-5"
            >
              <h2 className="text-xl md:text-2xl font-semibold text-indigo-700">Edit Staff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={editingStaff.name || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Name"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="role"
                  value={editingStaff.role || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Role"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="text"
                  name="phone"
                  value={editingStaff.phone || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Phone"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="experience"
                  value={editingStaff.experience || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="Experience (years)"
                  className="px-4 py-2 border rounded-md"
                  min={0}
                />
                <input
                  type="text"
                  name="qualification"
                  value={editingStaff.qualification || ''}
                  onChange={handleInputChange}
                  placeholder="Qualification"
                  className="px-4 py-2 border rounded-md"
                />
                <input
                  type="number"
                  name="salary"
                  value={editingStaff.salary || ''}
                  onChange={handleInputChange}
                  placeholder="Salary"
                  className="px-4 py-2 border rounded-md"
                  min={0}
                />
              </div>
              <div className="flex justify-end gap-4">
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
      </div>
    </div>
  );
};

export default Staff;
