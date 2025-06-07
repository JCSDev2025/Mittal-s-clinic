import express from 'express';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// GET all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new appointment
router.post('/', async (req, res) => {
  const { clientName, age, gender, contact, service, doctorName, date, time } = req.body;

  const newAppointment = new Appointment({
    clientName,
    age,
    gender,
    contact,
    service,
    doctorName,
    date,
    time,
  });

  try {
    const saved = await newAppointment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE appointment
router.put('/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
