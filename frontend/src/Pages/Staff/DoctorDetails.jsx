import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDetails = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetType, setTargetType] = useState('');
  const [assignedTargets, setAssignedTargets] = useState([]);

  const targetTypes = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/doctors');
        setDoctorsList(res.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchTargets = async () => {
      try {
        const res = await axios.get('/api/targets');
        setAssignedTargets(res.data);
      } catch (error) {
        console.error('Error fetching targets:', error);
      }
    };

    fetchDoctors();
    fetchTargets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !targetAmount || !targetType) {
      alert('Please fill all fields.');
      return;
    }

    const newTarget = {
      doctorId: selectedDoctor,
      targetAmount: parseFloat(targetAmount),
      targetType,
    };

    try {
      const res = await axios.post('/api/targets', newTarget);
      setAssignedTargets((prev) => [res.data, ...prev]);
      setSelectedDoctor('');
      setTargetAmount('');
      setTargetType('');
      alert('Target assigned successfully!');
    } catch (error) {
      console.error('Error assigning target:', error);
      alert('Failed to assign target.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/targets/${id}`);
      setAssignedTargets((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting target:', error);
      alert('Failed to delete target.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10 drop-shadow">
          Assign Target to Doctor
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Select Doctor</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose a Doctor --</option>
                {doctorsList.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} {doc.specialty ? `(${doc.specialty})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Target Amount (₹)</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Target Type</label>
              <select
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

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Assign Target
            </button>
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
                    <th className="py-3 px-4">S.No</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Target (₹)</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTargets.map((entry, index) => (
                    <tr
                      key={entry._id}
                      className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">{entry.doctorId?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">₹{entry.targetAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">{entry.targetType}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-red-600 font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assignedTargets.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
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
