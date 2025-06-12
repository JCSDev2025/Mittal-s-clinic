import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css'; // Removed to prevent compilation errors
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Importing an icon for empty state

const ITEMS_PER_PAGE = 10;

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const navigate = useNavigate();
    const location = useLocation();

    // States for custom delete confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [billToDeleteId, setBillToDeleteId] = useState(null);

    // Helper to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get('/api/bills');
                setBills(response.data);
            } catch (error) {
                console.error('Error fetching bills:', error);
                toast.error('Failed to fetch billing records', { position: 'top-right' });
            }
        };
        fetchBills();
    }, []);

    // Show toast if redirected from Edit page with success message
    useEffect(() => {
        if (location.state?.message) {
            toast.success(location.state.message, { position: 'top-right' });
            // Clear state message after showing toast once
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Function to initiate delete via custom modal
    const handleDelete = (id) => {
        setBillToDeleteId(id);
        setShowConfirmModal(true);
    };

    // Function to confirm and execute delete
    const confirmDeleteAction = async () => {
        if (!billToDeleteId) return; // Should not happen if modal is correctly triggered

        try {
            await axios.delete(`/api/bills/${billToDeleteId}`);
            const updatedBills = bills.filter((bill) => bill._id !== billToDeleteId);
            setBills(updatedBills);
            // Adjust current page if the last item on a page is deleted
            if (updatedBills.length <= (currentPage - 1) * ITEMS_PER_PAGE && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            toast.success('Bill deleted successfully', { position: 'top-right' });
        } catch (error) {
            console.error('Error deleting bill:', error);
            toast.error('Failed to delete the bill', { position: 'top-right' });
        } finally {
            setShowConfirmModal(false);
            setBillToDeleteId(null);
        }
    };

    // Function to cancel delete action
    const cancelDeleteAction = () => {
        setShowConfirmModal(false);
        setBillToDeleteId(null);
    };


    const handleEdit = (id) => {
        navigate(`/edit-bill/${id}`);
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return '-';
        }
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    // Filter bills based on search term
    const filteredBills = bills.filter(bill =>
        bill.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.assignedStaff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.services.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBills.length / ITEMS_PER_PAGE);
    const paginatedBills = filteredBills.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const goToPrevious = () => {
        setCurrentPage((page) => Math.max(page - 1, 1));
    };

    const goToNext = () => {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-10 flex flex-col items-center">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-green-900 drop-shadow-md text-center">
                Billing Records
            </h1>

            <div className="mb-8 w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                    onClick={() => navigate('/add-bill')}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition transform"
                >
                    Add New Bill
                </button>

                {/* Search Bar */}
                <div className="relative flex items-center group w-full sm:w-1/4">
                    <input
                        type="text"
                        placeholder="Search Bills"
                        className="w-full pl-10 pr-10 py-2 border border-green-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-800 transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset page to 1 on new search
                        }}
                    />
                    {/* Search Icon */}
                    <svg className="absolute left-3 w-5 h-5 text-green-500 group-focus-within:text-green-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    {/* Clear Button */}
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="absolute right-3 p-1 rounded-full text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                            aria-label="Clear search"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full max-w-7xl overflow-x-auto bg-white shadow-lg rounded-lg border border-green-200">
                <table className="w-full min-w-[1700px] text-left border-collapse">
                    <thead className="bg-green-600 text-white select-none">
                        <tr>
                            {/* Applied text-center to all table headers */}
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">S.no</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Client Name</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Staff Name</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Services</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Total Sessions</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Sessions Completed</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Cost (₹)</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Total Amount (incl. GST)</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Amount Paid (₹)</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Pending Amount (₹)</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Date</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Payment Method</th>
                            <th className="px-5 py-3 border-r whitespace-nowrap text-center">Remarks</th>
                            <th className="px-5 py-3 whitespace-nowrap text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedBills.length > 0 ? (
                            paginatedBills.map((bill, index) => (
                                <tr
                                    key={bill._id}
                                    className="border-b hover:bg-green-50 transition-colors"
                                >
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">
                                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                    </td>
                                    {/* Capitalized Client Name, Staff Name, and Services; applied text-center */}
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{capitalizeFirstLetter(bill.clientName)}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{capitalizeFirstLetter(bill.assignedStaff)}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap max-w-xs truncate text-center" title={bill.services}>
                                        {capitalizeFirstLetter(bill.services)}
                                    </td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{bill.totalSessions}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{bill.sessionsCompleted}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{formatCurrency(bill.cost)}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">
                                        {formatCurrency(bill.totalAmount)}
                                    </td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{formatCurrency(bill.amountPaid)}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{formatCurrency(bill.pendingAmount)}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{bill.date?.split('T')[0]}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap text-center">{bill.paymentMethod || '-'}</td>
                                    <td className="px-5 py-3 border-r whitespace-nowrap max-w-xs truncate text-center" title={bill.notes}>
                                        {bill.notes || '-'}
                                    </td>
                                    <td className="px-5 py-3 whitespace-nowrap flex gap-3 justify-center items-center"> {/* Centered buttons */}
                                        <button
                                            onClick={() => handleEdit(bill._id)}
                                            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(bill._id)}
                                            className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => navigate(`/invoice/${bill._id}`)}
                                            className="px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                        >
                                            Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center py-8 text-gray-500 text-lg font-medium">
                                    <div className="flex flex-col items-center justify-center">
                                        <DocumentMagnifyingGlassIcon className="h-12 w-12 text-green-400 mb-3" />
                                        No billing records found or matches your search.
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8 select-none">
                    <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md border border-green-600 font-semibold text-green-700
                            hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Previous
                    </button>
                    <span className="font-semibold text-green-900">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md border border-green-600 font-semibold text-green-700
                            hover:bg-green-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this bill? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={cancelDeleteAction}
                                className="bg-gray-300 px-5 py-2 rounded-md hover:bg-gray-400 text-gray-800 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAction}
                                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
