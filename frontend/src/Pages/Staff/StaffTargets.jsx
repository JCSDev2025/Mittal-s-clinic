import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css'; // Removed to prevent compilation errors
import { UserGroupIcon } from '@heroicons/react/24/outline'; // Import Heroicon for empty state

// Base URL for your backend API
const API_BASE_URL = '/api'; // IMPORTANT: Adjust if your backend is on a different port or domain

const StaffTargets = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const [assignedTargets, setAssignedTargets] = useState([]);
  const [editingTargetId, setEditingTargetId] = useState(null);

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // States for custom delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetToDeleteId, setTargetToDeleteId] = useState(null);


  // Effect to fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/staff`); // API connection for staff list
        setStaffList(res.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast.error('Failed to fetch staff list.', { position: 'top-right' });
      }
    };
    fetchStaff();
  }, []);

  // Effect to fetch targets (depends on staffList for populating staff names)
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/targets/staff`);
        setAssignedTargets(res.data);
      } catch (error) {
        console.error('Error fetching staff targets:', error);
        toast.error('Failed to load assigned staff targets.', { position: 'top-right' });
      }
    };

    if (staffList.length > 0) {
      fetchTargets();
    }
  }, [staffList]);

  // Handles both assigning a new target and updating an existing one
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStaff || !targetAmount) {
      toast.warn('Please fill all fields.', { position: 'top-right' });
      return;
    }

    if (parseFloat(targetAmount) <= 0) {
      toast.error('Target amount must be a positive number.', { position: 'top-right' });
      return;
    }

    const targetData = {
      staffId: selectedStaff,
      targetAmount: parseFloat(targetAmount),
    };

    try {
      let res;
      if (editingTargetId) {
        res = await axios.put(`${API_BASE_URL}/targets/staff/${editingTargetId}`, targetData);
        setAssignedTargets((prev) =>
          prev.map((target) => (target._id === editingTargetId ? res.data : target))
        );
        toast.success('Staff target updated successfully!', { position: 'top-right' });
      } else {
        res = await axios.post(`${API_BASE_URL}/targets/staff`, targetData);
        setAssignedTargets((prev) => [res.data, ...prev]);
        toast.success('Staff target assigned successfully!', { position: 'top-right' });
      }

      // Reset form fields and editing state
      setSelectedStaff('');
      setTargetAmount('');
      setEditingTargetId(null);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || (editingTargetId ? 'Failed to update staff target.' : 'Failed to assign staff target.');
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  const handleEdit = (target) => {
    // Set form fields with data from the target being edited
    setSelectedStaff(target.staffId._id);
    setTargetAmount(target.targetAmount.toString());
    setEditingTargetId(target._id);
  };

  // Function to initiate delete via custom modal
  const handleDelete = (id) => {
    setTargetToDeleteId(id);
    setShowConfirmModal(true);
  };

  // Function to confirm and execute delete
  const confirmDeleteAction = async () => {
    if (!targetToDeleteId) return; // Should not happen if modal is correctly triggered

    try {
      await axios.delete(`${API_BASE_URL}/targets/staff/${targetToDeleteId}`);
      setAssignedTargets((prev) => prev.filter((item) => item._id !== targetToDeleteId));
      toast.success('Staff target deleted successfully!', { position: 'top-right' });
      // If the deleted item was the one being edited, clear the editing state
      if (editingTargetId === targetToDeleteId) {
        setSelectedStaff('');
        setTargetAmount('');
        setEditingTargetId(null);
      }
    } catch (error) {
      console.error('Error deleting staff target:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete staff target.';
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setShowConfirmModal(false);
      setTargetToDeleteId(null);
    }
  };

  // Function to cancel delete action
  const cancelDeleteAction = () => {
    setShowConfirmModal(false);
    setTargetToDeleteId(null);
  };

  const handleCancelEdit = () => {
    setEditingTargetId(null);
    setSelectedStaff('');
    setTargetAmount('');
  };

  // Filter assigned targets based on search term
  const filteredAssignedTargets = assignedTargets.filter(entry =>
    entry.staffId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <> {/* Added React Fragment to wrap sibling elements */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10 drop-shadow">
            {editingTargetId ? 'Edit Staff Target' : 'Assign Target to Staff Member'}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-2xl p-8 space-y-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="staff-select" className="block text-gray-700 font-semibold mb-1">Select Staff Member</label>
                <select
                  id="staff-select"
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  disabled={!!editingTargetId}
                >
                  <option value="">-- Choose a Staff Member --</option>
                  {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name} {staff.role ? `(${staff.role})` : ''}
                    </option>
                  ))}
                </select>
                {editingTargetId && (
                  <p className="text-sm text-gray-500 mt-1">Staff member cannot be changed during edit.</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="target-amount" className="block text-gray-700 font-semibold mb-1">Target Amount (₹)</label>
                <input
                  id="target-amount"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
              >
                {editingTargetId ? 'Update Target' : 'Assign Target'}
              </button>
              {editingTargetId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-400 text-white font-bold rounded-md hover:bg-gray-500 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {/* Search Bar for Assigned Targets */}
          <div className="mb-6 relative flex items-center justify-center  group w-1/3 ">
            <input
              type="text"
              placeholder="Search targets by staff name..."
              className="w-full pl-10 pr-10 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-indigo-800 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Search Icon */}
            <svg className="absolute left-3 w-5 h-5 text-indigo-500 group-focus-within:text-indigo-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 p-1 rounded-full text-indigo-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            )}
          </div>

          {filteredAssignedTargets.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Assigned Staff Targets Summary
              </h2>
              <div className="overflow-x-auto rounded-xl shadow-md">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">S.No</th>
                      <th className="py-3 px-4 text-left">Staff Member</th>
                      <th className="py-3 px-4 text-left">Target (₹)</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssignedTargets.map((entry, index) => (
                      <tr
                        key={entry._id}
                        className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}
                      >
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">{entry.staffId?.name || 'Unknown'}</td>
                        <td className="py-3 px-4">₹{entry.targetAmount.toLocaleString()}</td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <div className="flex flex-col items-center">
                <UserGroupIcon className="h-10 w-10 mb-2 text-indigo-400" />
                No staff targets assigned yet or matches your search.
              </div>
            </div>
          )}
        </div>

        {/* Custom Delete Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this staff target? This action cannot be undone.</p>
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
    </>
  );
};

export default StaffTargets;
