import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Ensure 'toast' is imported here

const AddBilling = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        clientName: '',
        assignedStaff: '',
        services: '',
        totalSessions: '',
        sessionsCompleted: '',
        cost: '',
        amountPaid: '',
        date: '',
        paymentMethod: '',
        notes: '',
        totalAmount: '',
        pendingAmount: '',
    });

    // States for dropdown options fetched from APIs
    const [clientOptions, setClientOptions] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);
    const [error, setError] = useState(''); // State for displaying form-specific errors

    const navigate = useNavigate(); // Hook for programmatic navigation
    const { id } = useParams(); // Hook to get URL parameters (for edit mode)

    // Effect to fetch initial dropdown data (clients, staff, services)
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // Now fetching actual data from backend API endpoints
                const [clientsRes, staffRes, servicesRes] = await Promise.all([
                    axios.get('/api/clients'), // Fetch actual client data
                    axios.get('/api/staff'),   // Fetch actual staff data
                    axios.get('/api/services'), // Fetch actual service data
                ]);

                setClientOptions(clientsRes.data);
                setStaffOptions(staffRes.data);
                setServiceOptions(servicesRes.data);
            } catch (err) {
                console.error('Dropdown fetch error:', err);
                setError('Failed to load dropdown data. Please check your network connection and API endpoints.');
            }
        };

        fetchDropdownData();
    }, []); // Empty dependency array means this effect runs once on component mount

    // Effect to load bill data when in edit mode (if 'id' is present in URL)
    useEffect(() => {
        if (id) {
            axios.get(`/api/bills/${id}`) // Fetch actual bill data for editing
                .then((res) => {
                    const bill = res.data;
                    setFormData({
                        clientName: bill.clientName,
                        assignedStaff: bill.assignedStaff,
                        services: bill.services,
                        totalSessions: bill.totalSessions,
                        sessionsCompleted: bill.sessionsCompleted,
                        cost: bill.cost,
                        amountPaid: bill.amountPaid,
                        // Format date to 'YYYY-MM-DD' for input type="date"
                        date: bill.date.split('T')[0],
                        paymentMethod: bill.paymentMethod,
                        notes: bill.notes,
                        totalAmount: bill.totalAmount,
                        pendingAmount: bill.pendingAmount,
                    });
                })
                .catch((err) => {
                    console.error('Error loading bill:', err);
                    setError('Failed to load bill details for editing.');
                });
        }
    }, [id]); // Rerun when 'id' changes

    // Effect to calculate Total Amount (including 18% GST) based on Cost
    useEffect(() => {
        const cost = parseFloat(formData.cost);
        let calculatedTotalAmount = '';
        if (!isNaN(cost) && cost >= 0) {
            const gstAmount = cost * 0.18;
            calculatedTotalAmount = (cost + gstAmount).toFixed(2);
        }
        // Update totalAmount. If the user manually edits totalAmount, this will override
        // their edit if 'cost' changes again. This is by design to keep totalAmount
        // in sync with cost unless explicitly manually overridden without changing cost.
        setFormData((prev) => ({
            ...prev,
            totalAmount: calculatedTotalAmount,
        }));
    }, [formData.cost]); // Recalculate when 'cost' changes

    // Effect to calculate Pending Amount based on Total Amount and Amount Paid
    useEffect(() => {
        const total = parseFloat(formData.totalAmount);
        const paid = parseFloat(formData.amountPaid);
        let calculatedPendingAmount = '';

        if (!isNaN(total) && total >= 0) {
            if (!isNaN(paid) && paid >= 0) {
                calculatedPendingAmount = (total - paid).toFixed(2);
            } else {
                // If total is valid but paid is not, pending is total
                calculatedPendingAmount = total.toFixed(2);
            }
        } else {
            calculatedPendingAmount = ''; // Reset if total is invalid
        }

        setFormData((prev) => ({
            ...prev,
            pendingAmount: calculatedPendingAmount,
        }));
    }, [formData.totalAmount, formData.amountPaid]); // Recalculate when totalAmount or amountPaid changes

    // Generic handleChange function for all form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validation for numerical input fields
        if (['totalSessions', 'sessionsCompleted', 'cost', 'amountPaid', 'totalAmount', 'pendingAmount'].includes(name)) {
            // Allow empty string or valid numbers (integers or decimals)
            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            // For non-numerical inputs, update directly
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const {
            clientName,
            services,
            date,
            assignedStaff,
            totalSessions,
            sessionsCompleted,
            cost, // Included for backend, even if it's the base for totalAmount
            amountPaid,
            totalAmount,
            pendingAmount,
            paymentMethod // Include paymentMethod
        } = formData;

        // Basic form validation for required fields
        if (!clientName || !services || !date || !assignedStaff || totalSessions === '' || sessionsCompleted === '') {
            setError('Please fill all required fields.');
            return;
        }

        // Convert string values to numbers for validation
        const numTotalSessions = Number(totalSessions);
        const numSessionsCompleted = Number(sessionsCompleted);
        const numCost = Number(cost);
        const numAmountPaid = Number(amountPaid);
        const numTotalAmount = Number(totalAmount);
        const numPendingAmount = Number(pendingAmount);


        // More detailed numerical validations
        if (
            numTotalSessions <= 0 ||
            numSessionsCompleted < 0 ||
            numSessionsCompleted > numTotalSessions ||
            (cost !== '' && (isNaN(numCost) || numCost < 0)) ||
            (amountPaid !== '' && (isNaN(numAmountPaid) || numAmountPaid < 0))
        ) {
            setError('Please enter valid positive numerical values for sessions, cost, and amount paid.');
            return;
        }

        // Validate calculated amounts
        if (isNaN(numTotalAmount) || numTotalAmount < 0 || isNaN(numPendingAmount) || numPendingAmount < 0) {
            setError('Calculated amounts (Total Amount, Pending Amount) must be valid positive numbers.');
            return;
        }

        try {
            if (id) {
                // This block sends a PUT request to update an existing bill.
                await axios.put(`/api/bills/${id}`, formData);
                console.log(`Updated bill ID: ${id}`, formData);
                toast.success('Bill updated successfully!', { position: 'top-right' });
            } else {
                // This block sends a POST request to create a new bill.
                await axios.post('/api/bills', formData);
                console.log('New bill created:', formData);
                toast.success('Bill saved successfully!', { position: 'top-right' });
            }
            navigate('/billing'); // Navigate back to the billing list on successful submission
        } catch (err) {
            console.error('Error saving bill:', err);
            // Display a more user-friendly error message from the backend if available
            const errorMessage = err.response?.data?.message || 'Error saving bill. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage, { position: 'top-right' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 via-white to-green-50 px-6 py-12 font-sans">
            {/* ToastContainer for notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" // Changed theme for a cleaner look
            />

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-3xl w-full max-w-4xl p-10 sm:p-12 md:p-16"
            >
                <h2 className="text-4xl font-extrabold text-center text-green-800 mb-8 drop-shadow-md">
                    {id ? 'Edit Bill' : 'Add New Bill'}
                </h2>

                {/* Error message display */}
                {error && (
                    <div className="bg-red-100 text-red-700 text-center py-2 rounded-md mb-6 font-semibold shadow-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Client Name Dropdown */}
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-semibold text-gray-700 mb-2">Client Name <span className="text-red-500">*</span></label>
                        <select
                            id="clientName"
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

                    {/* Assigned Staff Dropdown */}
                    <div>
                        <label htmlFor="assignedStaff" className="block text-sm font-semibold text-gray-700 mb-2">Assigned Staff <span className="text-red-500">*</span></label>
                        <select
                            id="assignedStaff"
                            name="assignedStaff"
                            value={formData.assignedStaff}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
                        >
                            <option value="">Select Staff</option>
                            {/* Add "Clinic Sale" as a static option */}
                            <option value="Clinic Sale">Clinic Sale</option>
                            {/* Map through dynamically fetched staff options */}
                            {staffOptions.map(staff => (
                                <option key={staff._id} value={staff.name}>{staff.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Services Dropdown */}
                    <div>
                        <label htmlFor="services" className="block text-sm font-semibold text-gray-700 mb-2">Service <span className="text-red-500">*</span></label>
                        <select
                            id="services"
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

                    {/* Total Sessions Input */}
                    <div>
                        <label htmlFor="totalSessions" className="block text-sm font-semibold text-gray-700 mb-2">Total Sessions <span className="text-red-500">*</span></label>
                        <input
                            id="totalSessions"
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

                    {/* Sessions Completed Input */}
                    <div>
                        <label htmlFor="sessionsCompleted" className="block text-sm font-semibold text-gray-700 mb-2">Sessions Completed <span className="text-red-500">*</span></label>
                        <input
                            id="sessionsCompleted"
                            type="number"
                            name="sessionsCompleted"
                            value={formData.sessionsCompleted}
                            onChange={handleChange}
                            required
                            min="0"
                            max={formData.totalSessions !== '' ? parseFloat(formData.totalSessions) : undefined}
                            className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
                            placeholder="Enter sessions completed"
                        />
                    </div>

                    {/* Cost Input */}
                    <div>
                        <label htmlFor="cost" className="block text-sm font-semibold text-gray-700 mb-2">Cost (₹)</label>
                        <input
                            id="cost"
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
                            placeholder="Total cost before GST"
                        />
                    </div>

                    {/* Total Amount with GST (Editable) */}
                    <div>
                        <label htmlFor="totalAmount" className="block text-sm font-semibold text-gray-700 mb-2">Total Amount (incl. 18% GST)</label>
                        <input
                            id="totalAmount"
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
                            placeholder="Calculated total amount"
                        />
                    </div>

                    {/* Amount Paid Input */}
                    <div>
                        <label htmlFor="amountPaid" className="block text-sm font-semibold text-gray-700 mb-2">Amount Paid (₹)</label>
                        <input
                            id="amountPaid"
                            type="number"
                            name="amountPaid"
                            value={formData.amountPaid}
                            onChange={handleChange}
                            min="0"
                            max={formData.totalAmount !== '' ? parseFloat(formData.totalAmount) : undefined}
                            className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow shadow-sm"
                            placeholder="Amount paid by client"
                        />
                    </div>

                    {/* Pending Amount (Read-only) */}
                    <div>
                        <label htmlFor="pendingAmount" className="block text-sm font-semibold text-gray-700 mb-2">Pending Amount (₹)</label>
                        <input
                            id="pendingAmount"
                            type="text"
                            name="pendingAmount"
                            value={formData.pendingAmount}
                            readOnly
                            className="w-full px-5 py-3 bg-gray-100 border border-green-300 rounded-lg focus:outline-none shadow-sm text-gray-700"
                            placeholder="Calculated pending amount"
                        />
                    </div>

                    {/* Date Input */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-300 transition-shadow shadow-sm"
                        />
                    </div>

                    {/* Payment Method Dropdown */}
                    <div>
                        <label htmlFor="paymentMethod" className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                        <select
                            id="paymentMethod"
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

                    {/* Remarks Textarea */}
                    <div className="md:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows="4"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-5 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-300 transition-shadow shadow-sm resize-none"
                            placeholder="Additional remarks or notes"
                        ></textarea>
                    </div>
                </div>

                {/* Form Action Buttons */}
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
