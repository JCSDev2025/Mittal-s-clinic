import React from 'react';
import { useNavigate } from 'react-router-dom';

const Doctors = ({ doctors, setDoctors }) => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this doctor?');
    if (confirm) {
      const updatedDoctors = doctors.filter((doc) => doc.id !== id);
      setDoctors(updatedDoctors);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-doctor/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-indigo-900 drop-shadow-md text-center">
        Doctors List
      </h1>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/add-doctor')}
          className="px-6 py-2 sm:px-6 sm:py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 ease-in-out"
        >
           Add New Doctor
        </button>

        <button
          onClick={() => navigate('/targets')}
          className="px-6 py-2 sm:px-6 sm:py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all duration-200 ease-in-out"
        >
           Targets
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto max-w-7xl bg-white shadow-xl rounded-xl">
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">S.no</th>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">Name</th>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">Specialty</th>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">Email</th>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">Phone</th>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">Experience</th>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">Qualification</th>
              <th className="px-4 sm:px-6 py-3 border-r border-indigo-500">Availability</th>
              <th className="px-4 sm:px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map(
                (
                  {
                    id,
                    name,
                    specialty,
                    email,
                    phone,
                    experience,
                    qualification,
                    availability,
                  },
                  idx
                ) => (
                  <tr
                    key={id}
                    className={`border-b border-indigo-100 ${
                      idx % 2 === 0 ? 'bg-indigo-50' : ''
                    } hover:bg-indigo-100 transition`}
                  >
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200 font-medium">{id}</td>
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200">{name}</td>
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200">{specialty}</td>
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200">{email}</td>
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200">{phone}</td>
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200">{experience}</td>
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200">{qualification}</td>
                    <td className="px-4 sm:px-6 py-4 border-r border-indigo-200">{availability}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEdit(id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md shadow text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No doctors available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Doctors;
