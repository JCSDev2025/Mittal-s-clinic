import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAppointment = ({ appointments, setAppointments }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    age: '',
    gender: '',
    contact: '',
    symptoms: '',
    appointmentType: '',
    doctorName: '',
    specialization: '',
    date: '',
    time: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppointment = {
      id: appointments.length + 1,
      ...formData,
    };
    setAppointments([...appointments, newAppointment]);
    navigate('/appointments');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-white px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-teal-700">Add Appointment</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              required
              rows={2}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
              placeholder="Describe the symptoms briefly"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
            >
              <option value="">Select</option>
              <option value="General Checkup">General Checkup</option>
              <option value="Emergency">Emergency</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
              placeholder="e.g., Cardiologist, Dermatologist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-white rounded-md font-semibold hover:bg-teal-700"
          >
            Save Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointment;
