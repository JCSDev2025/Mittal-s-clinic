import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    experience: '',
    qualification: '',
    salary: '',
    availability: ''
  });

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`/api/doctors/${id}`);
      const { _id, createdAt, updatedAt, __v, ...rest } = response.data;
      setFormData(rest);
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
      alert('Error fetching doctor details');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/doctors/${id}`, formData);
      alert('Doctor details updated successfully');
      navigate('/doctors');
    } catch (error) {
      console.error('Failed to update doctor:', error);
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-indigo-200"
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-sm">
          Edit Doctor Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key}
              </label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                required
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Update Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
