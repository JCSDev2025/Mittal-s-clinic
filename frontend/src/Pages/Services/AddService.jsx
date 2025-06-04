import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddService = ({ services, setServices }) => {
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

  const handleSubmit = (e) => {
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
      return;
    }

    const newService = {
      id: services.length > 0 ? services[services.length - 1].id + 1 : 1,
      ...formData,
      price: Number(price),
      sessions: Number(sessions),
    };

    setServices([...services, newService]);
    navigate('/services');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 drop-shadow-sm">
          Add New Service
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Service name"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" disabled>Select Category</option>
              <option value="Hair">Hair</option>
              <option value="Skin">Skin</option>
              <option value="Dental">Dental</option>
              <option value="Surgery">Surgery</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Service description"
              rows={4}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              placeholder="Enter price"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Required Sessions</label>
            <input
              type="number"
              name="sessions"
              value={formData.sessions}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter number of sessions"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
          >
            Save Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
