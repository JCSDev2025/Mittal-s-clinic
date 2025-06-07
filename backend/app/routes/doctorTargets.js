import express from 'express';
import DoctorTarget from '../models/DoctorTarget.js';

const router = express.Router();

// POST - assign target
router.post('/', async (req, res) => {
  try {
    const { doctorId, targetAmount, targetType } = req.body;
    if (!doctorId || !targetAmount || !targetType) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newTarget = new DoctorTarget({ doctorId, targetAmount, targetType });
    await newTarget.save();
    const populatedTarget = await newTarget.populate('doctorId', 'name');
    res.status(201).json(populatedTarget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - fetch targets with doctor name
router.get('/', async (req, res) => {
  try {
    const targets = await DoctorTarget.find()
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(targets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - remove assigned target
router.delete('/:id', async (req, res) => {
  try {
    const result = await DoctorTarget.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Target not found' });
    res.status(200).json({ message: 'Target deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
