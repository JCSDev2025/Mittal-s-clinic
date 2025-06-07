import express from 'express';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// POST /api/doctors - Add new doctor
router.post('/', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error('Error saving doctor:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/doctors - Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// GET /api/doctors/:id - Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/doctors/:id - Delete doctor by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/doctors/:id - Update doctor by id
router.put('/:id', async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoctor) return res.status(404).json({ error: 'Doctor not found' });
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
