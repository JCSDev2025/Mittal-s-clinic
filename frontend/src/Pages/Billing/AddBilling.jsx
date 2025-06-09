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
    totalAmount: '', // Add totalAmount to formData state
    pendingAmount: '', // Add pendingAmount to formData state
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
            totalAmount: bill.totalAmount, // Load totalAmount from fetched data
            pendingAmount: bill.pendingAmount, // Load pendingAmount from fetched data
          });
        })
        .catch((err) => console.error('Error loading bill:', err));
    }
  }, [id]);

  useEffect(() => {
    const cost = parseFloat(formData.cost);
    let calculatedTotalAmount = '';
    if (!isNaN(cost)) {
      const gstAmount = cost * 0.18;
      calculatedTotalAmount = (cost + gstAmount).toFixed(2);
    }
    // Update formData with the calculated totalAmount
    setFormData((prev) => ({
      ...prev,
      totalAmount: calculatedTotalAmount,
    }));
  }, [formData.cost]);

  useEffect(() => {
    const total = parseFloat(formData.totalAmount);
    const paid = parseFloat(formData.amountPaid);
    let calculatedPendingAmount = '';

    if (!isNaN(total) && !isNaN(paid)) {
      calculatedPendingAmount = (total - paid).toFixed(2);
    } else if (!isNaN(total) && isNaN(paid)) {
        calculatedPendingAmount = total.toFixed(2); // If amount paid is not a number, pending is total amount
    } else {
        calculatedPendingAmount = '';
    }

    // Update formData with the calculated pendingAmount
    setFormData((prev) => ({
      ...prev,
      pendingAmount: calculatedPendingAmount,
    }));
  }, [formData.totalAmount, formData.amountPaid]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for strictly positive numbers for specific fields
    if (['totalSessions', 'sessionsCompleted', 'cost', 'amountPaid'].includes(name)) {
      // Allows empty string, or numbers (integers/decimals) that are non-negative
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      clientName,
      services,
      date,
      assignedDoctor,
      totalSessions,
      sessionsCompleted,
      cost,
      amountPaid,
      totalAmount, // Include totalAmount in destructuring
      pendingAmount, // Include pendingAmount in destructuring
    } = formData;

    if (!clientName || !services || !date || !assignedDoctor || !totalSessions || !sessionsCompleted) {
      setError('Please fill all required fields.');
      return;
    }

    // Numerical validations
    const numTotalSessions = Number(totalSessions);
    const numSessionsCompleted = Number(sessionsCompleted);
    const numCost = Number(cost);
    const numAmountPaid = Number(amountPaid);
    const numTotalAmount = Number(totalAmount);
    const numPendingAmount = Number(pendingAmount);


    if (
      numTotalSessions <= 0 ||
      numSessionsCompleted < 0 ||
      numSessionsCompleted > numTotalSessions ||
      (cost !== '' && numCost < 0) || // Check cost if it's not empty
      (amountPaid !== '' && numAmountPaid < 0) // Check amountPaid if it's not empty
    ) {
      setError('Please enter valid positive numerical values for sessions, cost, and amount paid.');
      return;
    }

    // Additional validation for totalAmount and pendingAmount (as they are calculated, primarily for display sanity)
    if (isNaN(numTotalAmount) || numTotalAmount < 0 || isNaN(numPendingAmount) || numPendingAmount < 0) {
        setError('Calculated amounts (Total Amount, Pending Amount) must be valid positive numbers.');
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
          {/* Client Name */}
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

          {/* Assigned Doctor */}
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

          {/* Services */}
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

          {/* Total Sessions */}
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

          {/* Sessions Completed */}
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

          {/* Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
              placeholder="Total cost before GST"
            />
          </div>

          {/* Total Amount with GST (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Amount (incl. 18% GST)</label>
            <input
              type="text"
              name="totalAmount" // Use name attribute to bind to formData
              value={formData.totalAmount} // Display value from formData
              readOnly
              className="w-full px-5 py-3 bg-gray-100 border border-green-300 rounded-lg focus:outline-none shadow-sm text-gray-700"
              placeholder="Calculated total amount"
            />
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid (₹)</label>
            <input
              type="number"
              name="amountPaid"
              value={formData.amountPaid}
              onChange={handleChange}
              min="0"
              // Optional: Max can be totalAmount if you want to prevent overpayment in the UI
              max={formData.totalAmount ? parseFloat(formData.totalAmount) : undefined}
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
              placeholder="Amount paid by client"
            />
          </div>

          {/* Pending Amount (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Pending Amount (₹)</label>
            <input
              type="text"
              name="pendingAmount" // Use name attribute to bind to formData
              value={formData.pendingAmount} // Display value from formData
              readOnly
              className="w-full px-5 py-3 bg-gray-100 border border-green-300 rounded-lg focus:outline-none shadow-sm text-gray-700"
              placeholder="Calculated pending amount"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-300 transition-shadow shadow-sm"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-300 transition-shadow shadow-sm"
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>

          {/* Remarks */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-300 transition-shadow shadow-sm resize-none"
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