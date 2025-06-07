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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, category, sessions } = formData;

    if (
      name.trim() === '' ||
      description.trim() === '' ||
      price === '' ||
      isNaN(price) ||
      Number(price) < 0 ||
      category === '' ||
      sessions === '' ||
      isNaN(sessions) ||
      Number(sessions) < 1
    ) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/services', {
        name,
        description,
        price: Number(price),
        category,
        sessions: Number(sessions),
      });
      navigate('/services');
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-3xl w-full rounded-3xl shadow-2xl p-10 sm:p-12 lg:p-16 space-y-8"
      >
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 drop-shadow-md mb-6">
          Add New Service
        </h2>

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
