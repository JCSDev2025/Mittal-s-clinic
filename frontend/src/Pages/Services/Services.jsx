import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilSquareIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
// Removed: import 'react-toastify/dist/ReactToastify.css'; // Removed to prevent compilation errors

const ITEMS_PER_PAGE = 10;

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // New state for search term
  const [searchTerm, setSearchTerm] = useState('');

  // States for custom delete confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error('Failed to fetch services.', { position: 'top-right' });
      }
    };
    fetchServices();
  }, []);

  // Function to initiate delete via custom modal
  const handleDelete = (id) => {
    setServiceToDeleteId(id);
    setShowConfirmModal(true);
  };

  // Function to confirm and execute delete
  const confirmDeleteAction = async () => {
    if (!serviceToDeleteId) return; // Should not happen if modal is correctly triggered

    try {
      await axios.delete(`/api/services/${serviceToDeleteId}`);
      const updatedServices = services.filter((s) => s._id !== serviceToDeleteId);
      setServices(updatedServices);

      // Adjust current page if the last item on a page was deleted
      if (updatedServices.length <= (currentPage - 1) * ITEMS_PER_PAGE && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      toast.success('Service deleted successfully!');
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error('Failed to delete service.');
    } finally {
      setShowConfirmModal(false);
      setServiceToDeleteId(null);
    }
  };

  // Function to cancel delete action
  const cancelDeleteAction = () => {
    setShowConfirmModal(false);
    setServiceToDeleteId(null);
  };


  const handleEdit = (service) => {
    setEditingService(service);
    setShowEditForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      // Allow only letters and spaces
      if (!/^[a-zA-Z ]*$/.test(value)) {
        return; // block invalid input
      }
    }

    setEditingService((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, category, price, sessions } = editingService;

    if (!/^[a-zA-Z0-9.\- ]+$/.test(name)) {
      toast.error('Service name can only contain letters, numbers, dot (.), and hyphen (-)');
      return false;
    }

    if (!/^[a-zA-Z ]+$/.test(category)) {
      toast.error('Category should contain only alphabets');
      return false;
    }

    // Convert price and sessions to numbers for proper validation
    const parsedPrice = Number(price);
    const parsedSessions = Number(sessions);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }

    if (isNaN(parsedSessions) || parsedSessions <= 1) {
      toast.error('Sessions must be greater than 1');
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingService) return; // Ensure editingService is not null

    if (!validateForm()) return;

    try {
      const response = await axios.put(`/api/services/${editingService._id}`, editingService);
      const updated = services.map((s) =>
        s._id === editingService._id ? response.data : s
      );
      setServices(updated);
      setShowEditForm(false);
      setEditingService(null);
      toast.success('Service updated successfully!');
    } catch (error) {
      console.error("Update failed:", error);
      toast.error('Failed to update service.');
    }
  };

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-6 md:p-12 flex flex-col items-center">
      <ToastContainer />
      <h1 className="text-4xl font-extrabold mb-10 text-blue-900 tracking-wide drop-shadow-md">
        Services List
      </h1>

      <div className="mb-8 w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={() => navigate('/add-service')}
          className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 active:scale-95 transition-transform"
          aria-label="Add New Service"
        >
          Add New Service
        </button>

        {/* Search Bar */}
        <div className="relative flex items-center group w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search service by name..."
            className="w-full pl-10 pr-10 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page to 1 on new search
            }}
          />
          {/* Search Icon */}
          <svg className="absolute left-3 w-5 h-5 text-blue-500 group-focus-within:text-blue-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-3 p-1 rounded-full text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full table-auto border-separate border-spacing-y-3">
          <thead className="bg-blue-700 text-white rounded-t-lg">
            <tr className="rounded-t-lg">
              <th className="py-3 px-4 rounded-tl-lg text-center font-semibold">S.no</th>
              <th className="py-3 px-6 font-semibold text-left">Name</th>
              <th className="py-3 px-6 font-semibold text-left">Category</th>
              <th className="py-3 px-6 font-semibold text-left">Description</th>
              <th className="py-3 px-6 font-semibold text-right">Price (₹)</th>
              <th className="py-3 px-6 font-semibold text-center">Sessions</th>
              <th className="py-3 px-6 rounded-tr-lg text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service, idx) => (
                <tr
                  key={service._id}
                  className="bg-gray-50 shadow-sm rounded-lg transition duration-200 hover:shadow-md hover:bg-white"
                >
                  <td className="text-center py-4 px-4 font-semibold text-blue-700">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="py-4 px-6 font-medium capitalize text-gray-900 max-w-xs truncate">{service.name}</td>
                  <td className="py-4 px-6 capitalize text-gray-700 max-w-xs truncate">{service.category}</td>
                  <td className="py-4 px-6 text-gray-600 max-w-lg truncate">{service.description}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">{Number(service.price).toLocaleString('en-IN')}</td>
                  <td className="py-4 px-6 text-center font-medium text-gray-800">{service.sessions}</td>
                  <td className="py-4 px-6 flex justify-center items-center space-x-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex items-center gap-1 text-sm px-4 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white shadow-sm transition"
                      aria-label={`Edit service ${service.name}`}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="flex items-center gap-1 text-sm px-4 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition"
                      aria-label={`Delete service ${service.name}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-16 text-gray-400 font-semibold">
                  <div className="flex flex-col items-center">
                    <ClipboardDocumentListIcon className="h-14 w-14 mb-3 text-blue-400" />
                    No services available or matches your search.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-8 flex justify-center items-center space-x-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md shadow-md text-white ${
              currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
            }`}
            aria-label="Previous page"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md shadow-md font-semibold ${
                currentPage === i + 1 ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-300'
              }`}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md shadow-md text-white ${
              currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}

      {showEditForm && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-6 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-3xl font-bold text-blue-800 mb-5 text-center">
              Edit Service
            </h2>

            <input
              type="text"
              name="name"
              value={editingService.name || ''}
              onChange={handleInputChange}
              required
              placeholder="Service Name"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="category"
              value={editingService.category || ''}
              onChange={handleInputChange}
              required
              placeholder="Category"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              name="description"
              value={editingService.description || ''}
              onChange={handleInputChange}
              required
              placeholder="Description"
              rows={4}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input
                type="number"
                name="price"
                value={editingService.price || ''}
                onChange={handleInputChange}
                required
                placeholder="Price"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="sessions"
                value={editingService.sessions || ''}
                onChange={handleInputChange}
                required
                placeholder="Sessions"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingService(null);
                }}
                className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this service? This action cannot be undone.</p>
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

export default Services;
