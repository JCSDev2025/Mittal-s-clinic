import { Patient, Doctor, Appointment, Treatment } from './models/models.js';


export default function registerRoutes(app) {

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

app.post('/api/patientDetails', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json({ message: 'Patient details saved', patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/patientDetails/:id', async (req, res) => {
  try {
    const patientId = req.params.id;
    console.log("Updating patient with ID:", patientId);
    console.log("Request body:", req.body);
    const updatedPatient = await Patient.findByIdAndUpdate(patientId, req.body, { new: true });
    if (!updatedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }   
    res.status(200).json({ message: 'Patient details updated', patient: updatedPatient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});

app.delete('/api/patientDetails/:id', async (req, res) => {
  try {
    const patientId = req.params.id;
    const deletedPatient = await Patient.findByIdAndDelete(patientId);
    if (!deletedPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }   
    res.status(200).json({ message: 'Patient details deleted', patient: deletedPatient });
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/doctorDetails', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor details saved', doctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/doctorDetails/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, req.body, { new: true });
    if (!updatedDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }     
    res.status(200).json({ message: 'Doctor details updated', doctor: updatedDoctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/doctorDetails/:id', async (req, res) => {
  try {
    const doctorId = req.params.id;
    const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);
    if (!deletedDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }     
    res.status(200).json({ message: 'Doctor details deleted', doctor: deletedDoctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
);


app.post('/api/appointment', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: 'Appointment created', appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// edit an appointment
app.put('/api/appointment/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }     
    res.status(200).json({ message: 'Appointment updated', appointment: updatedAppointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// cancel an appointment
app.delete('/api/appointment/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }     
    res.status(200).json({ message: 'Appointment cancelled', appointment: deletedAppointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Create a treatment
app.post('/api/treatments', async (req, res) => {
  try {
    const treatment = new Treatment(req.body);
    await treatment.save();
    res.status(201).json({ message: 'Treatment saved', treatment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch all treatments
app.get('/api/treatments', async (req, res) => {
  try {
    const treatments = await Treatment.find();
    res.status(200).json(treatments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a treatment
app.put('/api/treatments/:id', async (req, res) => {
  try {
    const treatmentId = req.params.id;
    const updatedTreatment = await Treatment.findByIdAndUpdate(treatmentId, req.body, { new: true });
    if (!updatedTreatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }   
    res.status(200).json({ message: 'Treatment updated', treatment: updatedTreatment });

  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
});

// Delete a treatment
app.delete('/api/treatments/:id', async (req, res) => {
  try {
    const treatmentId = req.params.id;
    const deletedTreatment = await Treatment.findByIdAndDelete(treatmentId);
    if (!deletedTreatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }   
    res.status(200).json({ message: 'Treatment deleted', treatment: deletedTreatment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/appointments/by-doctor/:doctorName', async (req, res) => {
  try {
    const doctorName = req.params.doctorName;
    const appointments = await Appointment.find({ doctorName: doctorName });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/appointments/by-patient/:patientName', async (req, res) => { 
    try {
        const patientName = req.params.patientName;
        const appointments = await Appointment.find({ patientName: patientName });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
}