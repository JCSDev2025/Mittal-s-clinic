import React from 'react';
import { useNavigate } from 'react-router-dom';

const Appointments = ({ appointments, setAppointments }) => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    const confirm = window.confirm('Are you sure you want to delete this appointment?');
    if (confirm) {
      const updatedAppointments = appointments.filter((appt) => appt.id !== id);
      setAppointments(updatedAppointments);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-appointment/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-teal-900 drop-shadow-md text-center">
        Appointments List
      </h1>

      <button
        onClick={() => navigate('/add-appointment')}
        className="mb-6 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition"
      >
        Add New Appointment
      </button>

      <div className="w-full overflow-x-auto max-w-7xl bg-white shadow-lg rounded-lg">
        <table className="w-full min-w-[1200px] text-left border-collapse">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="px-4 py-3 border-r">S.no</th>
              <th className="px-4 py-3 border-r">Client Name</th>
              <th className="px-4 py-3 border-r">Age</th>
              <th className="px-4 py-3 border-r">Gender</th>
              <th className="px-4 py-3 border-r">Contact</th>
              <th className="px-4 py-3 border-r">Symptoms</th>
              <th className="px-4 py-3 border-r">Appointment Type</th>
              <th className="px-4 py-3 border-r">Doctor Name</th>
              <th className="px-4 py-3 border-r">Specialization</th>
              <th className="px-4 py-3 border-r">Date</th>
              <th className="px-4 py-3 border-r">Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt, idx) => (
                <tr
                  key={appt.id}
                  className={`border-b border-teal-100 ${idx % 2 === 0 ? 'bg-teal-50' : ''} hover:bg-teal-100 transition`}
                >
                  <td className="px-4 py-3 border-r">{appt.id}</td>
                  <td className="px-4 py-3 border-r">{appt.clientName}</td>
                  <td className="px-4 py-3 border-r">{appt.age}</td>
                  <td className="px-4 py-3 border-r">{appt.gender}</td>
                  <td className="px-4 py-3 border-r">{appt.contact}</td>
                  <td className="px-4 py-3 border-r">{appt.symptoms}</td>
                  <td className="px-4 py-3 border-r">{appt.appointmentType}</td>
                  <td className="px-4 py-3 border-r">{appt.doctorName}</td>
                  <td className="px-4 py-3 border-r">{appt.specialization}</td>
                  <td className="px-4 py-3 border-r">{appt.date}</td>
                  <td className="px-4 py-3 border-r">{appt.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(appt.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-6 text-gray-600">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
