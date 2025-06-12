import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { toast, ToastContainer } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css'; // Removed to prevent compilation errors

const ITEMS_PER_PAGE = 10;

const Clients = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 10;

    // New state for search term
    const [searchTerm, setSearchTerm] = useState('');

    // States for custom delete confirmation modal
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [clientToDeleteId, setClientToDeleteId] = useState(null);

    // Helper to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get('/api/clients');
                setClients(response.data);
            } catch (error) {
                console.error("Error fetching clients:", error);
                toast.error('Failed to fetch clients list.', { position: 'top-right' });
            }
        };
        fetchClients();
    }, []);

    // Function to initiate delete via custom modal
    const handleDelete = (id) => {
        setClientToDeleteId(id);
        setShowConfirmModal(true);
    };

    // Function to confirm and execute delete
    const confirmDeleteAction = async () => {
        if (!clientToDeleteId) return; // Should not happen if modal is correctly triggered

        try {
            await axios.delete(`/api/clients/${clientToDeleteId}`);
            setClients(clients.filter((client) => client._id !== clientToDeleteId));
            toast.success('Client deleted successfully', { position: 'top-right' });
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error(error.response?.data?.message || 'Failed to delete client', { position: 'top-right' });
        } finally {
            setShowConfirmModal(false);
            setClientToDeleteId(null);
        }
    };

    // Function to cancel delete action
    const cancelDeleteAction = () => {
        setShowConfirmModal(false);
        setClientToDeleteId(null);
    };

    const handleEdit = (client) => {
        // Format the DOB to 'YYYY-MM-DD' for the input type="date"
        const formattedClient = {
            ...client,
            dob: client.dob ? new Date(client.dob).toISOString().split('T')[0] : ''
        };
        setEditingClient(formattedClient);
        setShowEditForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name' && !/^[a-zA-Z\s.]*$/.test(value)) return;
        if (name === 'age' && value !== '' && (!/^\d+$/.test(value) || Number(value) <= 0)) return;
        // Mobile number validation, allow empty string to clear input, but enforce 10 digits for non-empty
        if (name === 'mobile' && value !== '' && !/^\d{0,10}$/.test(value)) return;


        setEditingClient((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const { name, age, mobile, address, dob, gender } = editingClient;

        if (!name || !age || !mobile || !address || !dob || !gender) {
            toast.error('Please fill all fields', { position: 'top-right' });
            return;
        }

        if (!/^[a-zA-Z\s.]+$/.test(name)) {
            toast.error('Name must contain only alphabets, spaces, and periods', { position: 'top-right' });
            return;
        }

        if (!/^\d{10}$/.test(mobile)) {
            toast.error('Mobile must be 10 digits only', { position: 'top-right' });
            return;
        }

        try {
            const response = await axios.put(`/api/clients/${editingClient._id}`, editingClient);
            const updatedClients = clients.map((c) =>
                c._id === editingClient._id ? response.data : c
            );
            setClients(updatedClients);
            setShowEditForm(false);
            setEditingClient(null);
            toast.success('Client updated successfully', { position: 'top-right' });
        } catch (error) {
            console.error("Update failed:", error);
            toast.error(error.response?.data?.message || 'Failed to update client', { position: 'top-right' });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Ensure valid date, otherwise return empty string
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-IN');
    };

    const formatMobile = (mobile) => {
        if (!mobile) return '';
        return `+91 ${mobile.replace(/(\d{5})(\d{5})/, "$1 $2")}`;
    };

    // Filter clients based on search term
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.mobile.includes(searchTerm) // Exact match for mobile, or partial if desired
    );

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const paginatedClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    const goToPage = (page) => setCurrentPage(page);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-8 flex flex-col items-center">
            <ToastContainer />
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-emerald-900">Clients List</h1>

            <div className="mb-6 flex flex-col md:flex-row gap-4 w-full max-w-5xl justify-between items-center">
                <button
                    onClick={() => navigate('/add-client')}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-md shadow hover:bg-emerald-700 transition"
                >
                    Add New Client
                </button>

                {/* Search Bar */}
                <div className="relative flex items-center group w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Search by name or mobile..."
                        className="w-full pl-10 pr-10 py-2 border border-emerald-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-800 transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset page to 1 on new search
                        }}
                    />
                    {/* Search Icon */}
                    <svg className="absolute left-3 w-5 h-5 text-emerald-500 group-focus-within:text-emerald-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    {/* Clear Button */}
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCurrentPage(1);
                            }}
                            className="absolute right-3 p-1 rounded-full text-emerald-500 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            aria-label="Clear search"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    )}
                </div>

                <button
                    onClick={() => navigate('/client-details')}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition"
                >
                    Client Details
                </button>
            </div>

            <div className="w-full overflow-x-auto rounded-lg bg-white shadow max-w-6xl">
                <table className="min-w-full text-sm text-gray-800">
                    <thead className="bg-emerald-600 text-white">
                        <tr>
                            {['S.No', 'Name', 'Age', 'Mobile', 'Address', 'DOB', 'Gender', 'Actions'].map((head, i) => (
                                <th key={i} className="px-4 py-3 border-r last:border-r-0 whitespace-nowrap text-sm md:text-base text-center">
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedClients.length > 0 ? (
                            paginatedClients.map((client, idx) => (
                                <tr
                                    key={client._id}
                                    className={`transition hover:bg-emerald-50 ${idx % 2 ? 'bg-white' : 'bg-emerald-50'}`}
                                >
                                    <td className="px-4 py-3 text-center">{indexOfFirstClient + idx + 1}</td>
                                    {/* Capitalized Name, applied text-center */}
                                    <td className="px-4 py-3 text-center">{capitalizeFirstLetter(client.name)}</td>
                                    <td className="px-4 py-3 text-center">{client.age}</td>
                                    <td className="px-4 py-3 text-center">{formatMobile(client.mobile)}</td>
                                    <td className="px-4 py-3 text-center">{capitalizeFirstLetter(client.address)}</td> {/* Capitalized Address */}
                                    <td className="px-4 py-3 text-center">{formatDate(client.dob)}</td>
                                    <td className="px-4 py-3 text-center">{capitalizeFirstLetter(client.gender)}</td> {/* Capitalized Gender */}
                                    <td className="px-4 py-3 text-center flex flex-row justify-center gap-2">
                                        <button
                                            onClick={() => handleEdit(client)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                                        >
                                            <PencilSquareIcon className="h-4 w-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                                        >
                                            <TrashIcon className="h-4 w-4" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <UserGroupIcon className="h-10 w-10 mb-2 text-emerald-400" />
                                        No clients found or matches your search.
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToPage(idx + 1)}
                            className={`px-4 py-2 rounded-md border ${
                                currentPage === idx + 1
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-emerald-600 border-emerald-300 hover:bg-emerald-100'
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {showEditForm && editingClient && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
                    <form onSubmit={handleUpdate} className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-xl space-y-5 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-xl md:text-2xl font-semibold text-emerald-700">Edit Client</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="name" value={editingClient.name || ''} onChange={handleInputChange} required placeholder="Full Name" className="px-4 py-2 border rounded-md" />
                            <input type="number" name="age" value={editingClient.age || ''} onChange={handleInputChange} required placeholder="Age" className="px-4 py-2 border rounded-md" />
                            <input type="text" name="mobile" value={editingClient.mobile || ''} onChange={handleInputChange} required placeholder="10-digit Mobile Number" className="px-4 py-2 border rounded-md" />
                            <input type="text" name="address" value={editingClient.address || ''} onChange={handleInputChange} required placeholder="Address" className="px-4 py-2 border rounded-md" />
                            <input type="date" name="dob" value={editingClient.dob || ''} onChange={handleInputChange} required className="px-4 py-2 border rounded-md col-span-1 md:col-span-2" />
                            <select name="gender" value={editingClient.gender || ''} onChange={handleInputChange} className="px-4 py-2 border rounded-md col-span-1 md:col-span-2" required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => { setShowEditForm(false); setEditingClient(null); }}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-emerald-600 text-white px-5 py-2 rounded hover:bg-emerald-700"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this client? This action cannot be undone.</p>
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

export default Clients;
