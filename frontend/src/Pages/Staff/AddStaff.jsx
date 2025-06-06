import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    experience: '',
    qualification: '',
    salary: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = {
      ...formData,
      experience: Number(formData.experience),
      salary: Number(formData.salary),
    };

    try {
      await axios.post('http://localhost:3000/api/staff', dataToSend);
      navigate('/staff'); // Redirect after successful save
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 drop-shadow-sm">
          Add New Staff
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary (₹)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/staff')}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Staff'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
