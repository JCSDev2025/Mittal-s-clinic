import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddService = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sessions: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Directly defining the API base URL to resolve compilation issues in this Canvas environment.
  // In a real Vite project, you would typically use `import.meta.env.VITE_API_BASE_URL`
  // and configure it via a .env file.
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation on input for 'name' (service name)
    if (name === 'name') {
      // Allow letters, numbers, dots, commas, hyphens, spaces
      const validPattern = /^[a-zA-Z0-9.,-\s]*$/;
      if (!validPattern.test(value)) return; // ignore invalid input
    }

    // For price and sessions, allow only digits (and for price also allow empty input)
    if (name === 'price') {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    if (name === 'sessions') {
      // allow only digits
      if (value === '' || /^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, description, price, category, sessions } = formData;

    // Validation on submit
    if (!name.trim()) {
      setError('Service Name is required.');
      return;
    }
    if (!/^[a-zA-Z0-9.,-\s]+$/.test(name.trim())) {
      setError(
        'Service Name can only contain letters, numbers, spaces, dots (.), commas (,), and hyphens (-).'
      );
      return;
    }

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    if (price === '') {
      setError('Price is required.');
      return;
    }
    if (isNaN(price) || Number(price) < 0) {
      setError('Price must be a positive number or zero.');
      return;
    }

    if (!category) {
      setError('Category is required.');
      return;
    }

    if (sessions === '') {
      setError('Required Sessions is required.');
      return;
    }
    if (!/^\d+$/.test(sessions) || Number(sessions) < 1) {
      setError('Required Sessions must be a positive integer.');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/services`, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        sessions: Number(sessions),
      });
      navigate('/services');
    } catch (error) {
      console.error('Error adding service:', error);
      setError('Failed to add service. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-3xl w-full rounded-3xl shadow-2xl p-10 sm:p-12 lg:p-16 space-y-8"
        noValidate
      >
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-md mb-6">
          Add New Service
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold tracking-wide">Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter service name"
              className="rounded-xl border border-gray-300 px-5 py-3 text-lg placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600
                shadow-sm transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold tracking-wide">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="rounded-xl border border-gray-300 px-5 py-3 text-lg placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600
                shadow-sm transition"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Hair">Hair</option>
              <option value="Skin">Skin</option>
              <option value="Dental">Dental</option>
              <option value="Surgery">Surgery</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold tracking-wide">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the service"
              className="rounded-xl border border-gray-300 px-5 py-4 text-lg placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600
                shadow-sm transition resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold tracking-wide">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0"
              className="rounded-xl border border-gray-300 px-5 py-3 text-lg placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600
                shadow-sm transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700 font-semibold tracking-wide">Required Sessions</label>
            <input
              type="number"
              name="sessions"
              value={formData.sessions}
              onChange={handleChange}
              required
              min="1"
              step="1"
              placeholder="1"
              className="rounded-xl border border-gray-300 px-5 py-3 text-lg placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-600
                shadow-sm transition"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-6 mt-6">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="px-7 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold
              hover:bg-gray-100 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700 transition shadow-lg"
          >
            Save Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
