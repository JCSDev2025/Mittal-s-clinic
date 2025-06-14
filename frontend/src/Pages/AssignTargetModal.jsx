// src/components/AssignTargetModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const AssignTargetModal = ({ onTargetAssigned }) => {
    const [branchTargets, setBranchTargets] = useState([]);
    const [targetAmount, setTargetAmount] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [editingTargetId, setEditingTargetId] = useState(null);

    const navigate = useNavigate();

    // Helper to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Helper for INR formatting
    const inrFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    });

    // --- Data Fetching Function ---
    const fetchBranchTargets = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/branchtargets'); // Your backend API endpoint
            setBranchTargets(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching branch targets:', error);
            toast.error('Failed to load branch targets.', { position: 'top-right' });
            setLoading(false);
        }
    };

    // Initial data fetch on component mount
    useEffect(() => {
        fetchBranchTargets();
    }, []);

    const handleAddUpdateTarget = async (e) => { // Made async
        e.preventDefault();

        if (!targetAmount || isNaN(targetAmount) || parseFloat(targetAmount) <= 0) {
            toast.error('Please enter a valid positive target amount.', { position: 'top-right' });
            return;
        }

        const newAmount = parseFloat(targetAmount);
        const targetData = {
            amount: newAmount,
            period: selectedPeriod,
        };

        try {
            if (editingTargetId) {
                // Update existing target
                await axios.put(`/api/branchtargets/${editingTargetId}`, targetData);
                toast.success(`Branch Target updated successfully!`, { position: 'top-right' });
                setEditingTargetId(null);
            } else {
                // Create new target
                await axios.post('/api/branchtargets', targetData);
                toast.success(`New Branch Target assigned successfully!`, { position: 'top-right' });
            }

            // After successful operation, re-fetch data to update the list
            fetchBranchTargets();
            setTargetAmount('');
            setSelectedPeriod('monthly');
            if (onTargetAssigned) {
                onTargetAssigned(); // Notify parent component (e.g., Dashboard) if needed
            }
        } catch (error) {
            console.error('Error adding/updating target:', error.response ? error.response.data : error.message);
            toast.error(`Failed to save target: ${error.response?.data?.message || error.message}`, { position: 'top-right' });
        }
    };

    const handleEdit = (target) => {
        setEditingTargetId(target._id); // Use MongoDB's _id
        setTargetAmount(target.amount.toString());
        setSelectedPeriod(target.period);
    };

    const handleDelete = async (id) => { // Made async
        if (window.confirm('Are you sure you want to delete this target?')) {
            try {
                await axios.delete(`/api/branchtargets/${id}`);
                toast.info('Branch Target deleted successfully!', { position: 'top-right' });
                fetchBranchTargets(); // Re-fetch data
                if (editingTargetId === id) {
                    setEditingTargetId(null);
                    setTargetAmount('');
                    setSelectedPeriod('monthly');
                }
            } catch (error) {
                console.error('Error deleting target:', error.response ? error.response.data : error.message);
                toast.error(`Failed to delete target: ${error.response?.data?.message || error.message}`, { position: 'top-right' });
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingTargetId(null);
        setTargetAmount('');
        setSelectedPeriod('monthly');
    };

    const handleCloseModalAndNavigate = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl animate-pulse">
                    <p className="text-lg text-slate-700">Loading branch targets...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto font-inter">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 relative">
                <button
                    onClick={handleCloseModalAndNavigate}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h2 className="text-4xl font-bold text-center text-indigo-800 mb-10 drop-shadow">
                    {editingTargetId ? 'Edit Branch Target' : 'Assign New Branch Target'}
                </h2>

                {/* --- Form for New/Edit Target --- */}
                <form onSubmit={handleAddUpdateTarget} className="bg-blue-50 shadow-xl rounded-2xl p-8 space-y-6 mb-8">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                        {editingTargetId ? 'Modify Branch Target' : 'Create New Branch Target'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="targetAmount" className="block text-gray-700 font-semibold mb-1">Target Amount (INR):</label>
                            <input
                                type="number"
                                id="targetAmount"
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., 500000"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="periodSelect" className="block text-gray-700 font-semibold mb-1">Target Period:</label>
                            <select
                                id="periodSelect"
                                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                required
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="half-yearly">Half-Yearly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        {editingTargetId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-2 bg-gray-400 text-white font-bold rounded-md hover:bg-gray-500 transition"
                            >
                                Cancel Edit
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
                        >
                            {editingTargetId ? 'Update Target' : 'Assign Target'}
                        </button>
                    </div>
                </form>

                {/* --- List of Existing Branch Targets --- */}
                <section className="bg-gray-50 shadow-xl rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Existing Branch Targets</h3>
                    {branchTargets.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <div className="flex flex-col items-center">
                                <BuildingOfficeIcon className="h-10 w-10 mb-2 text-indigo-400" />
                                <p>No branch targets set yet. Add one above!</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-xl shadow-md">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-indigo-600 text-white">
                                    <tr>
                                        <th className="py-3 px-4 text-left">S.No</th>
                                        <th className="py-3 px-4 text-left">Target Amount</th>
                                        <th className="py-3 px-4 text-left">Period</th>
                                        <th className="py-3 px-4 text-left">Date Set</th>
                                        <th className="py-3 px-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {branchTargets.map((target, index) => (
                                        <tr
                                            key={target._id} // Use MongoDB's _id for key
                                            className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}
                                        >
                                            <td className="py-3 px-4">{index + 1}</td>
                                            <td className="py-3 px-4">{inrFormatter.format(target.amount)}</td>
                                            <td className="py-3 px-4">{capitalizeFirstLetter(target.period)}</td>
                                            <td className="py-3 px-4">{dayjs(target.dateSet).format('YYYY-MM-DD')}</td> {/* Format date */}
                                            <td className="py-3 px-4 space-x-2">
                                                <button
                                                    onClick={() => handleEdit(target)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                                    disabled={editingTargetId === target._id}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(target._id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                                    disabled={editingTargetId === target._id}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleCloseModalAndNavigate}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignTargetModal;