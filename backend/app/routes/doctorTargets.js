import express from 'express';
import DoctorTarget from '../models/DoctorTarget.js';

const router = express.Router();

// POST - assign new target
router.post('/', async (req, res) => {
  try {
    const { doctorId, targetAmount, targetType } = req.body;

    // Validate required fields
    if (!doctorId || !targetAmount || !targetType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate targetAmount to be a positive number
    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ message: 'Target amount must be a positive number.' });
    }

    const newTarget = new DoctorTarget({ doctorId, targetAmount, targetType });
    await newTarget.save();

    // Populate the doctorId field with the doctor's name before sending the response
    const populatedTarget = await newTarget.populate('doctorId', 'name');
    res.status(201).json(populatedTarget);
  } catch (error) {
    console.error('Error assigning target:', error);
    res.status(500).json({ message: 'Failed to assign target.', error: error.message });
  }
});

// GET - fetch all targets with doctor name
router.get('/', async (req, res) => {
  try {
    const targets = await DoctorTarget.find()
      .populate('doctorId', 'name') // Populate the doctorId field to get the doctor's name
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(targets);
  } catch (error) {
    console.error('Error fetching targets:', error);
    res.status(500).json({ message: 'Failed to fetch targets.', error: error.message });
  }
});

// PUT - update an existing target by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorId, targetAmount, targetType } = req.body;

    // Validate required fields
    if (!doctorId || !targetAmount || !targetType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate targetAmount to be a positive number
    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ message: 'Target amount must be a positive number.' });
    }

    // Find the target by ID and update it
    const updatedTarget = await DoctorTarget.findByIdAndUpdate(
      id,
      { doctorId, targetAmount, targetType },
      { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` runs schema validators
    ).populate('doctorId', 'name'); // Populate doctorId after update

    // Check if the target was found and updated
    if (!updatedTarget) {
      return res.status(404).json({ message: 'Target not found' });
    }

    res.status(200).json(updatedTarget);
  } catch (error) {
    console.error('Error updating target:', error);
    res.status(500).json({ message: 'Failed to update target.', error: error.message });
  }
});

// DELETE - remove an assigned target by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DoctorTarget.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Target not found' });
    }

    res.status(200).json({ message: 'Target deleted successfully' });
  } catch (error) {
    console.error('Error deleting target:', error);
    res.status(500).json({ message: 'Failed to delete target.', error: error.message });
  }
});

export default router;