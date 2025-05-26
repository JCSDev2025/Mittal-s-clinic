import app from '../serverEntry.js';
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


app.post('/api/doctorDetails', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor details saved', doctor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/appointment', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: 'Appointment created', appointment });
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