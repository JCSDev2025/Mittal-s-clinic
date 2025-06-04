// src/components/AddClient.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddClient = ({ clients, setClients }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile: '',
    address: '',
    dob: '',
    gender: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, age, mobile, address, dob, gender } = formData;

    if (!name.trim() || isNaN(age) || Number(age) <= 0 || !mobile.trim() || !dob || !gender) return;

    const newClient = {
      id: clients.length + 1,
      name: name.trim(),
      age: Number(age),
      mobile,
      address,
      dob,
      gender,
    };

    setClients([...clients, newClient]);
    navigate('/clients');
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-emerald-700 text-center">Add New Client</h2>

        <div>
          <label className="block font-medium text-gray-700">Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            required
            placeholder="John Doe"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Age</label>
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              type="number"
              min="1"
              required
              placeholder="28"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Mobile No.</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              type="tel"
              pattern="[0-9]{10}"
              required
              placeholder="1234567890"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="123 Main St, City, Country"
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Date of Birth</label>
            <input
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              type="date"
              required
              className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Gender</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  className="mr-2"
                  checked={formData.gender === 'Male'}
                />
                Male
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  className="mr-2"
                  checked={formData.gender === 'Female'}
                />
                Female
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  onChange={handleChange}
                  className="mr-2"
                  checked={formData.gender === 'Other'}
                />
                Other
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
