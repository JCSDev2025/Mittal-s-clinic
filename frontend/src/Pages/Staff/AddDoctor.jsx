import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddDoctor = ({ doctors, setDoctors }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '+91',
    experience: '',
    qualification: '',
    availability: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
      case 'specialty':
      case 'qualification':
        if (!value.trim()) return `${name[0].toUpperCase() + name.slice(1)} is required`;
        if (!/^[A-Za-z.\s]+$/.test(value)) return 'Only letters, spaces, and dot (.) allowed';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        break;
      case 'phone':
        if (!value.trim()) return 'Phone is required';
        if (!/^\+91\d{10}$/.test(value)) return 'Phone must be 10 digits after +91';
        break;
      case 'experience':
      case 'salary':
        if (!value) return `${name[0].toUpperCase() + name.slice(1)} is required`;
        if (isNaN(value) || Number(value) < 0) return 'Only positive numbers allowed';
        break;
      case 'availability':
        if (!value.trim()) return 'Availability is required';
        if (!/^(\d{1,2}-\d{1,2})$/.test(value)) return 'Format should be like 9-5 or 10-6';
        break;
      default:
        return '';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    for (const field in formData) {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Filter only letters, dot, and space for specific fields
    if (['name', 'specialty', 'qualification'].includes(name)) {
      newValue = newValue.replace(/[^A-Za-z.\s]/g, '');
    }

    // Phone number validation
    if (name === 'phone') {
      if (!/^\+91\d{0,10}$/.test(newValue)) return;
    }

    // Numeric only for experience and salary
    if ((name === 'experience' || name === 'salary') && !/^\d*$/.test(newValue)) return;

    // Availability validation
    if (name === 'availability' && newValue && !/^\d{0,2}-?\d{0,2}$/.test(newValue)) return;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    const error = validateField(name, newValue);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setLoading(true);

    const dataToSend = {
      ...formData,
      experience: Number(formData.experience),
      salary: Number(formData.salary),
    };

    try {
      const response = await axios.post('http://localhost:3000/api/doctors', dataToSend);
      setDoctors([...doctors, response.data]);
      navigate('/doctors');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Something went wrong');
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
          Add New Doctor
        </h2>

        {submitError && (
          <div className="bg-red-100 text-red-700 p-2 rounded">{submitError}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Specialty', name: 'specialty', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone (+91)', name: 'phone', type: 'text' },
            { label: 'Experience (years)', name: 'experience', type: 'text' },
            { label: 'Qualification', name: 'qualification', type: 'text' },
            { label: 'Salary (₹)', name: 'salary', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 ${
                  errors[name] ? 'border-red-500' : ''
                }`}
              />
              {errors[name] && (
                <p className="text-sm text-red-500 mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Availability</label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="E.g., 9-5 or 10-6"
              required
              className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 ${
                errors.availability ? 'border-red-500' : ''
              }`}
            />
            {errors.availability && (
              <p className="text-sm text-red-500 mt-1">{errors.availability}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
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
            {loading ? 'Saving...' : 'Save Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
