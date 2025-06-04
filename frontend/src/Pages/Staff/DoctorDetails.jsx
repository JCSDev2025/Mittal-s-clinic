import React, { useState } from 'react';

const DoctorDetails = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetType, setTargetType] = useState('');
  const [assignedTargets, setAssignedTargets] = useState([]);

  const doctorsList = ['Mounika', 'Ravi', 'Anjali', 'Kiran'];
  const targetTypes = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDoctor || !targetAmount || !targetType) {
      alert('Please select doctor, amount, and target type.');
      return;
    }

    const newEntry = {
      name: selectedDoctor,
      target: parseFloat(targetAmount),
      type: targetType,
    };

    setAssignedTargets((prev) => [...prev, newEntry]);
    setSelectedDoctor('');
    setTargetAmount('');
    setTargetType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-blue-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700 mb-8">Assign Target to Doctor</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl space-y-4"
      >
        {/* Doctor Dropdown */}
        <div>
          <label htmlFor="doctor" className="block text-gray-700 font-semibold mb-1">
            Select Doctor:
          </label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Choose a Doctor --</option>
            {doctorsList.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>

        {/* Target Amount Input */}
        <div>
          <label htmlFor="target" className="block text-gray-700 font-semibold mb-1">
            Target Amount (₹):
          </label>
          <input
            type="number"
            id="target"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="Enter amount in ₹"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Target Type Dropdown */}
        <div>
          <label htmlFor="type" className="block text-gray-700 font-semibold mb-1">
            Target Type:
          </label>
          <select
            id="type"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Select Target Type --</option>
            {targetTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Assign Target
        </button>
      </form>

      {/* Summary Table */}
      {assignedTargets.length > 0 && (
        <div className="mt-10 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Assigned Targets Summary</h2>
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <table className="w-full table-auto text-left">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3">S.No</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Target (₹)</th>
                  <th className="px-4 py-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {assignedTargets.map((entry, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{entry.name}</td>
                    <td className="px-4 py-3">₹{entry.target.toLocaleString()}</td>
                    <td className="px-4 py-3">{entry.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
