import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddBilling = ({ bills, setBills }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    assignedDoctor: '',
    services: '',
    requiredSessions: '',
    cost: '',
    amountPaid: '',
    date: '',
    paymentMethod: '',
    notes: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();

  // Example client and service options
  const clientOptions = ['John Doe', 'Jane Smith', 'Alice Johnson'];
  const serviceOptions = ['Physiotherapy', 'Counseling', 'Massage Therapy'];

  useEffect(() => {
    if (id) {
      const billToEdit = bills.find((b) => b.id === parseInt(id));
      if (billToEdit) {
        const {
          clientId,
          clientName,
          assignedDoctor,
          services,
          requiredSessions,
          cost,
          amountPaid,
          date,
          paymentMethod,
          notes,
        } = billToEdit;
        setFormData({
          clientId,
          clientName,
          assignedDoctor,
          services,
          requiredSessions,
          cost,
          amountPaid,
          date,
          paymentMethod,
          notes,
        });
      }
    }
  }, [id, bills]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      const updatedBills = bills.map((b) =>
        b.id === parseInt(id) ? { ...formData, id: parseInt(id) } : b
      );
      setBills(updatedBills);
    } else {
      const newBill = {
        id: bills.length + 1,
        ...formData,
      };
      setBills([...bills, newBill]);
    }

    navigate('/billing');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-green-700 drop-shadow-sm">
          {id ? 'Edit Bill' : 'Add New Bill'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client ID</label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <select
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Client</option>
              {clientOptions.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Doctor</label>
            <input
              type="text"
              name="assignedDoctor"
              value={formData.assignedDoctor}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Services</label>
            <select
              name="services"
              value={formData.services}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Service</option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Required Sessions</label>
            <input
              type="number"
              name="requiredSessions"
              value={formData.requiredSessions}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Paid ($)</label>
            <input
              type="number"
              name="amountPaid"
              value={formData.amountPaid}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
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
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remarks / Notes</label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/billing')}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
          >
            {id ? 'Update Bill' : 'Save Bill'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBilling;
