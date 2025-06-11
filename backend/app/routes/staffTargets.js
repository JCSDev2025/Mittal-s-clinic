import express from 'express';
import StaffTarget from '../models/StaffTarget.js';

const router = express.Router();

// POST - assign new target to staff
router.post('/', async (req, res) => {
  try {
    // Destructure without targetType
    const { staffId, targetAmount } = req.body;

    // Validation without targetType
    if (!staffId || !targetAmount) {
      return res.status(400).json({ message: 'Staff ID and Target Amount are required' }); // Updated message
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ message: 'Target amount must be a positive number.' });
    }

    // Create new target without targetType
    const newTarget = new StaffTarget({ staffId, targetAmount });
    await newTarget.save();

    const populatedTarget = await newTarget.populate('staffId', 'name');
    res.status(201).json(populatedTarget);
  } catch (error) {
    console.error('Error assigning target:', error);
    res.status(500).json({ message: 'Failed to assign target.', error: error.message });
  }
});

// GET - fetch all staff targets (no change needed here for targetType removal)
router.get('/', async (req, res) => {
  try {
    const targets = await StaffTarget.find()
      .populate('staffId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(targets);
  } catch (error) {
    console.error('Error fetching targets:', error);
    res.status(500).json({ message: 'Failed to fetch targets.', error: error.message });
  }
});

// PUT - update staff target by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Destructure without targetType
    const { staffId, targetAmount } = req.body;

    // Validation without targetType
    if (!staffId || !targetAmount) {
      return res.status(400).json({ message: 'Staff ID and Target Amount are required' }); // Updated message
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ message: 'Target amount must be a positive number.' });
    }

    // Update target without targetType
    const updatedTarget = await StaffTarget.findByIdAndUpdate(
      id,
      { staffId, targetAmount },
      { new: true, runValidators: true }
    ).populate('staffId', 'name');

    if (!updatedTarget) {
      return res.status(404).json({ message: 'Target not found' });
    }

    res.status(200).json(updatedTarget);
  } catch (error) {
    console.error('Error updating target:', error);
    res.status(500).json({ message: 'Failed to update target.', error: error.message });
  }
});

// DELETE - remove a staff target by ID (no change needed here)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await StaffTarget.findByIdAndDelete(id);

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