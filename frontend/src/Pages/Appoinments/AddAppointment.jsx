import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddAppointment = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    age: '',
    gender: '',
    contact: '+91',   // default +91
    service: '',
    doctorName: '',
    date: '',
    time: '',
  });

  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [contactError, setContactError] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  // Validate contact number (only digits after +91 and exactly 10 digits)
  const validateContact = (contact) => {
    // contact should start with +91 and followed by exactly 10 digits
    const regex = /^\+91[0-9]{10}$/;
    return regex.test(contact);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'clientName') {
      const selectedClient = clients.find(client => client.name === value);

      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientName: selectedClient.name,
          age: selectedClient.age || '',
          gender: selectedClient.gender || '',
          contact: selectedClient.mobile ? (selectedClient.mobile.startsWith('+91') ? selectedClient.mobile : '+91' + selectedClient.mobile) : '+91',
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          clientName: '',
          age: '',
          gender: '',
          contact: '+91',
        }));
      }
    } else if (name === 'contact') {
      // Ensure value starts with +91
      if (!value.startsWith('+91')) {
        setFormData(prev => ({ ...prev, contact: '+91' }));
        setContactError('Contact number must start with +91');
        return;
      }
      // Remove all non-digit chars except + in start
      let digitsPart = value.slice(3); // part after +91
      // Only allow digits for digitsPart
      digitsPart = digitsPart.replace(/\D/g, '');
      // Limit length to 10 digits
      if (digitsPart.length > 10) digitsPart = digitsPart.slice(0, 10);
      const newContact = '+91' + digitsPart;
      setFormData(prev => ({ ...prev, contact: newContact }));

      // Validate length
      if (digitsPart.length < 10) {
        setContactError('Contact number must be 10 digits after +91');
      } else {
        setContactError('');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields manually if needed (they have required attribute, but just extra check)
    if (
      !formData.clientName ||
      !formData.age ||
      !formData.gender ||
      !formData.contact ||
      !formData.service ||
      !formData.doctorName ||
      !formData.date ||
      !formData.time
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!validateContact(formData.contact)) {
      alert('Please enter a valid contact number starting with +91 and followed by 10 digits.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/appointments', formData);
      alert('Appointment added successfully');
      navigate('/appointments');
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert('Failed to add appointment');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-50 via-teal-50 to-cyan-50 px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl max-w-3xl w-full p-10 sm:p-12 md:p-16
                   grid grid-cols-1 gap-8 sm:grid-cols-2"
        style={{ boxShadow: '0 20px 40px rgba(0, 128, 128, 0.15)' }}
      >
        <h2 className="sm:col-span-2 text-center text-4xl font-extrabold text-teal-800 tracking-tight mb-4">
          Add New Appointment
        </h2>

        {/* Client Name */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Client Name<span className="text-red-600">*</span></label>
          <select
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client._id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Age */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Age<span className="text-red-600">*</span></label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            placeholder="Age"
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            min={0}
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Gender<span className="text-red-600">*</span></label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Contact */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Contact Number<span className="text-red-600">*</span></label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            maxLength={13} // +91 + 10 digits = 13 chars
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            placeholder="+91XXXXXXXXXX"
            pattern="\+91[0-9]{10}"
            title="Contact number must start with +91 and contain 10 digits after it."
          />
          {contactError && (
            <p className="text-red-600 mt-1 text-sm">{contactError}</p>
          )}
        </div>

        {/* Service */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Service<span className="text-red-600">*</span></label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <option value="">Select Service</option>
            {services.map(service => (
              <option key={service._id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Doctor Name<span className="text-red-600">*</span></label>
          <select
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            <option value="">Select Doctor</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Date<span className="text-red-600">*</span></label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>

        {/* Time */}
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Time<span className="text-red-600">*</span></label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
        </div>

        {/* Buttons - full width on small screens */}
        <div className="sm:col-span-2 flex justify-end gap-6 mt-6">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="rounded-lg border border-gray-300 px-8 py-3 text-gray-700 font-semibold
                       hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-8 py-3 text-white font-semibold
                       hover:bg-teal-700 transition shadow-lg"
            disabled={contactError.length > 0}
          >
            Save Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointment;
