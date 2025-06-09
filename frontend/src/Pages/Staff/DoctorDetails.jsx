import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorDetails = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetType, setTargetType] = useState('');
  const [assignedTargets, setAssignedTargets] = useState([]);
  const [editingTargetId, setEditingTargetId] = useState(null); // State to store the ID of the target being edited

  const targetTypes = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  // Effect to fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/doctors');
        setDoctorsList(res.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to fetch doctors list.', { position: 'top-right' });
      }
    };
    fetchDoctors();
  }, []);

  // Effect to fetch targets (depends on doctorsList for populating doctor names)
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await axios.get('/api/targets');
        // The backend now populates 'doctorId' with the doctor object (including 'name').
        // So, we can directly use entry.doctorId.name.
        setAssignedTargets(res.data);
      } catch (error) {
        console.error('Error fetching targets:', error);
        toast.error('Failed to load assigned targets.', { position: 'top-right' });
      }
    };

    // Only fetch targets if doctorsList is available, to ensure correct doctor names
    if (doctorsList.length > 0) {
      fetchTargets();
    }
  }, [doctorsList]); // Add doctorsList as a dependency

  // Handles both assigning a new target and updating an existing one
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !targetAmount || !targetType) {
      toast.warn('Please fill all fields.', { position: 'top-right' });
      return;
    }

    if (parseFloat(targetAmount) <= 0) {
      toast.error('Target amount must be a positive number.', { position: 'top-right' });
      return;
    }

    const targetData = {
      doctorId: selectedDoctor,
      targetAmount: parseFloat(targetAmount),
      targetType,
    };

    try {
      let res;
      if (editingTargetId) {
        // If editing, send a PUT request
        res = await axios.put(`/api/targets/${editingTargetId}`, targetData);
        setAssignedTargets((prev) =>
          prev.map((target) => (target._id === editingTargetId ? res.data : target))
        );
        toast.success('Target updated successfully!', { position: 'top-right' });
      } else {
        // If not editing, send a POST request
        res = await axios.post('/api/targets', targetData);
        setAssignedTargets((prev) => [res.data, ...prev]);
        toast.success('Target assigned successfully!', { position: 'top-right' });
      }

      // Reset form fields and editing state
      setSelectedDoctor('');
      setTargetAmount('');
      setTargetType('');
      setEditingTargetId(null);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || (editingTargetId ? 'Failed to update target.' : 'Failed to assign target.');
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  const handleEdit = (target) => {
    // Set form fields with data from the target being edited
    setSelectedDoctor(target.doctorId._id); // Assuming doctorId is an object with _id
    setTargetAmount(target.targetAmount.toString());
    setTargetType(target.targetType);
    setEditingTargetId(target._id); // Set the ID of the target being edited
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this target?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/targets/${id}`);
      setAssignedTargets((prev) => prev.filter((item) => item._id !== id));
      toast.success('Target deleted successfully!', { position: 'top-right' });
      // If the deleted item was the one being edited, clear the editing state
      if (editingTargetId === id) {
        setSelectedDoctor('');
        setTargetAmount('');
        setTargetType('');
        setEditingTargetId(null);
      }
    } catch (error) {
      console.error('Error deleting target:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete target.';
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  const handleCancelEdit = () => {
    setEditingTargetId(null);
    setSelectedDoctor('');
    setTargetAmount('');
    setTargetType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10 drop-shadow">
          {editingTargetId ? 'Edit Doctor Target' : 'Assign Target to Doctor'}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="doctor-select" className="block text-gray-700 font-semibold mb-1">Select Doctor</label>
              <select
                id="doctor-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                disabled={!!editingTargetId} // Disable doctor selection during edit
              >
                <option value="">-- Choose a Doctor --</option>
                {doctorsList.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} {doc.specialty ? `(${doc.specialty})` : ''}
                  </option>
                ))}
              </select>
              {editingTargetId && (
                <p className="text-sm text-gray-500 mt-1">Doctor cannot be changed during edit.</p>
              )}
            </div>

            <div>
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

            <div className="md:col-span-2">
              <label htmlFor="target-type" className="block text-gray-700 font-semibold mb-1">Target Type</label>
              <select
                id="target-type"
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Type --</option>
                {targetTypes.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
                type="button" // Important: set type to button to prevent form submission
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-400 text-white font-bold rounded-md hover:bg-gray-500 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {assignedTargets.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              Assigned Targets Summary
            </h2>
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">S.No</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Target (₹)</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTargets.map((entry, index) => (
                    <tr
                      key={entry._id}
                      className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{entry.doctorId?.name || 'Unknown'}</td> {/* Access name from populated doctorId */}
                      <td className="py-3 px-4">₹{entry.targetAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">{entry.targetType}</td>
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
                  {assignedTargets.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No targets assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;