import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AddBilling = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    assignedDoctor: '',
    services: '',
    totalSessions: '',
    sessionsCompleted: '',
    cost: '',
    amountPaid: '',
    date: '',
    paymentMethod: '',
    notes: '',
  });

  const [clientOptions, setClientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [clients, doctors, services] = await Promise.all([
          axios.get('/api/clients'),
          axios.get('/api/doctors'),
          axios.get('/api/services'),
        ]);
        setClientOptions(clients.data);
        setDoctorOptions(doctors.data);
        setServiceOptions(services.data);
      } catch (err) {
        console.error('Dropdown fetch error:', err);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`/api/bills/${id}`)
        .then((res) => {
          const bill = res.data;
          setFormData({
            clientName: bill.clientName,
            assignedDoctor: bill.assignedDoctor,
            services: bill.services,
            totalSessions: bill.totalSessions,
            sessionsCompleted: bill.sessionsCompleted,
            cost: bill.cost,
            amountPaid: bill.amountPaid,
            date: bill.date.split('T')[0],
            paymentMethod: bill.paymentMethod,
            notes: bill.notes,
          });
        })
        .catch((err) => console.error('Error loading bill:', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.clientName || !formData.services || !formData.date || !formData.assignedDoctor || !formData.totalSessions || !formData.sessionsCompleted) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      if (id) {
        await axios.put(`/api/bills/${id}`, formData);
      } else {
        await axios.post('/api/bills', formData);
      }
      navigate('/billing');
    } catch (err) {
      console.error('Error saving bill:', err);
      setError('Error saving bill. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 via-white to-green-50 px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-3xl w-full max-w-4xl p-10 sm:p-12 md:p-16"
      >
        <h2 className="text-4xl font-extrabold text-center text-green-800 mb-8 drop-shadow-md">
          {id ? 'Edit Bill' : 'Add New Bill'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-center py-2 rounded-md mb-6 font-semibold shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/** Select Inputs */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name <span className="text-red-500">*</span></label>
            <select
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
            >
              <option value="">Select Client</option>
              {clientOptions.map(client => (
                <option key={client._id} value={client.name}>{client.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Doctor <span className="text-red-500">*</span></label>
            <select
              name="assignedDoctor"
              value={formData.assignedDoctor}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
            >
              <option value="">Select Doctor</option>
              {doctorOptions.map(doctor => (
                <option key={doctor._id} value={doctor.name}>{doctor.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service <span className="text-red-500">*</span></label>
            <select
              name="services"
              value={formData.services}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
            >
              <option value="">Select Service</option>
              {serviceOptions.map(service => (
                <option key={service._id} value={service.name}>{service.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Sessions <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="totalSessions"
              value={formData.totalSessions}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
              placeholder="Enter total number of sessions"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sessions Completed <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="sessionsCompleted"
              value={formData.sessionsCompleted}
              onChange={handleChange}
              required
              min="0"
              max={formData.totalSessions || undefined}
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
              placeholder="Enter sessions completed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
              placeholder="Total cost"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid (₹)</label>
            <input
              type="number"
              name="amountPaid"
              value={formData.amountPaid}
              onChange={handleChange}
              min="0"
              max={formData.cost || undefined}
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
              placeholder="Amount paid"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm resize-none"
              placeholder="Additional remarks or notes"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-6 mt-10">
          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="px-7 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 shadow-lg transition duration-300"
          >
            {id ? 'Update Bill' : 'Save Bill'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBilling;
