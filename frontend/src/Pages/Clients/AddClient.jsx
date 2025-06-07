import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddClient = ({ clients = [], setClients }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile: '',
    address: '',
    dob: '',
    gender: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, age, mobile, address, dob, gender } = formData;

    if (!name.trim() || isNaN(age) || Number(age) <= 0 || !mobile.trim() || !dob || !gender) {
      setError('Please fill all required fields correctly.');
      return;
    }

    try {
      const response = await axios.post('/api/clients', {
        name: name.trim(),
        age: Number(age),
        mobile,
        address,
        dob,
        gender,
      });

      setClients([...(Array.isArray(clients) ? clients : []), response.data]);
      navigate('/clients');
    } catch (err) {
      console.error('Failed to add client:', err);
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-emerald-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white shadow-xl rounded-xl px-8 py-10 space-y-6 border border-gray-200"
      >
        <h2 className="text-4xl font-bold text-center text-emerald-700">Add New Client</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
            {error}
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium">Full Name <span className="text-red-500">*</span></label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            required
            placeholder="John Doe"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Age <span className="text-red-500">*</span></label>
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              type="number"
              min="1"
              required
              placeholder="28"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Mobile No. <span className="text-red-500">*</span></label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              type="tel"
              pattern="[0-9]{10}"
              required
              placeholder="1234567890"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="123 Main St, City, Country"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Date of Birth <span className="text-red-500">*</span></label>
            <input
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              type="date"
              required
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Gender <span className="text-red-500">*</span></label>
            <div className="flex gap-6 mt-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    onChange={handleChange}
                    checked={formData.gender === g}
                    className="accent-emerald-500"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 transition shadow"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
