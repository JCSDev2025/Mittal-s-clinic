import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors');
      const result = response.data;
      if (Array.isArray(result)) {
        setDoctors(result);
      } else {
        console.error('Unexpected response format:', result);
        setDoctors([]);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setDoctors([]);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`/api/doctors/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      alert('Failed to delete doctor');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-doctor/${id}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  const startIdx = (currentPage - 1) * doctorsPerPage;
  const currentDoctors = doctors.slice(startIdx, startIdx + doctorsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-indigo-800 mb-8 drop-shadow-md">
          Doctors Management
        </h1>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => navigate('/add-doctor')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Add New Doctor
          </button>
          <button
            onClick={() => navigate('/targets')}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
          >
            View Targets
          </button>
        </div>

        <div className="overflow-auto rounded-xl shadow-lg">
          <table className="w-full min-w-[1100px] bg-white text-sm text-left">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="py-3 px-4 border-r border-indigo-600">S.No</th>
                <th className="py-3 px-4 border-r border-indigo-600">Name</th>
                <th className="py-3 px-4 border-r border-indigo-600">Specialty</th>
                <th className="py-3 px-4 border-r border-indigo-600">Email</th>
                <th className="py-3 px-4 border-r border-indigo-600">Phone</th>
                <th className="py-3 px-4 border-r border-indigo-600">Experience</th>
                <th className="py-3 px-4 border-r border-indigo-600">Qualification</th>
                <th className="py-3 px-4 border-r border-indigo-600">Salary (₹)</th>
                <th className="py-3 px-4 border-r border-indigo-600">Availability</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor, idx) => (
                  <tr
                    key={doctor._id}
                    className={`border-b transition ${idx % 2 === 0 ? 'bg-indigo-50' : 'bg-white'} hover:bg-indigo-100`}
                  >
                    <td className="py-3 px-4 border-r">{startIdx + idx + 1}</td>
                    <td className="py-3 px-4 border-r">{doctor.name}</td>
                    <td className="py-3 px-4 border-r">{doctor.specialty}</td>
                    <td className="py-3 px-4 border-r">{doctor.email}</td>
                    <td className="py-3 px-4 border-r">{doctor.phone}</td>
                    <td className="py-3 px-4 border-r">{doctor.experience}</td>
                    <td className="py-3 px-4 border-r">{doctor.qualification}</td>
                    <td className="py-3 px-4 border-r">₹{doctor.salary}</td>
                    <td className="py-3 px-4 border-r">{doctor.availability}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEdit(doctor._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-md shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(doctor._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-6 text-gray-500">
                    No doctors available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => goToPage(idx + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === idx + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
