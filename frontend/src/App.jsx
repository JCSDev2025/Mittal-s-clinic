import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
import Dashboard from './Components/Dashboard';
import Doctors from "./Pages/Staff/Doctors";
import DoctorDetails from "./Pages/Staff/DoctorDetails";
import EditDoctor from './Pages/Staff/EditDoctor';
import Clients from "./Pages/Clients/Clients";
import Services from "./Pages/Services/Services";
import Appointments from "./Pages/Appoinments/Appointments";
import Billing from "./Pages/Billing/Billing"
import Reports from './Pages/Reports';
import AddDoctor from "./Pages/Staff/AddDoctor";
import AddClient from "./Pages/Clients/AddClient";
import ClientDetails from "./Pages/Clients/ClientDetails";
import AddService from "./Pages/Services/AddService";
import AddAppointment from "./Pages/Appoinments/AddAppointment";
import AddBilling from "./Pages/Billing/AddBilling";
import Login from './Components/Login';
import Staff from './Pages/Staff/Staff';
import AddStaff from './Pages/Staff/AddStaff';
import InvoicePage from './Pages/InvoicePage';
import StaffTargets from './Pages/Staff/StaffTargets';
import AssignTargetModal from './Pages/AssignTargetModal'; // Make sure this import is correct

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleSetIsAuthenticated = (value) => {
    localStorage.setItem('isAuthenticated', value);
    setIsAuthenticated(value);
  };

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="*" element={<Login setIsAuthenticated={handleSetIsAuthenticated} />} />
      ) : (
        <Route path="/" element={<Layout setIsAuthenticated={handleSetIsAuthenticated} />}>
          <Route index element={<Dashboard />} />
          <Route path="doctors" element={<Doctors doctors={[]} setDoctors={() => {}} />} />
          <Route path="add-doctor" element={<AddDoctor doctors={[]} setDoctors={() => {}} />} />
          <Route path="targets" element={<DoctorDetails />} />
          <Route path="/edit-doctor/:id" element={<EditDoctor />} />
          <Route path="staff" element={<Staff />} />
          <Route path="add-staff" element={<AddStaff />} />
          <Route path="clients" element={<Clients clients={[]} setClients={() => {}} />} />
          <Route path="add-client" element={<AddClient clientss={[]} setClients={() => {}} />} />
          <Route path="client-details" element={<ClientDetails />} />
          <Route path="services" element={<Services services={[]} setServices={() => {}} />} />
          <Route path="add-service" element={<AddService services={[]} setServices={() => {}} />} />
          <Route path="appointments" element={<Appointments appointments={[]} setAppointments={() => {}} />} />
          <Route path="add-appointment" element={<AddAppointment appointments={[]} setAppointments={() => {}} />} />
          <Route path="billing" element={<Billing bills={[]} setBills={() => {}} />} />
          <Route path="add-bill" element={<AddBilling bills={[]} setBills={() => {}} />} />
          <Route path="edit-bill/:id" element={<AddBilling bills={[]} setBills={() => {}} />} />
          <Route path="reports" element={<Reports />} />
          <Route path="/invoice/:id" element={<InvoicePage />} />
          <Route path="/stafftargets" element={<StaffTargets />} />
          {/* New route for Branch Targets */}
          <Route path="/branchtargets" element={<AssignTargetModal onClose={() => {}} onTargetAssigned={() => {}} />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;