import express from 'express';
import StaffTarget from '../models/StaffTarget.js';

const router = express.Router();

// Allowed types
const validTargetTypes = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

// POST - assign new target to staff
router.post('/', async (req, res) => {
  try {
    const { staffId, targetAmount, targetType } = req.body;

    if (!staffId || !targetAmount || !targetType) {
      return res.status(400).json({ message: 'Staff ID, Target Amount, and Target Type are required' });
    }

    if (!validTargetTypes.includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ message: 'Target amount must be a positive number.' });
    }

    const newTarget = new StaffTarget({ staffId, targetAmount, targetType });
    await newTarget.save();

    const populatedTarget = await newTarget.populate('staffId', 'name');
    res.status(201).json(populatedTarget);
  } catch (error) {
    console.error('Error assigning target:', error);
    res.status(500).json({ message: 'Failed to assign target.', error: error.message });
  }
});

// GET - fetch all staff targets
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
    const { staffId, targetAmount, targetType } = req.body;

    if (!staffId || !targetAmount || !targetType) {
      return res.status(400).json({ message: 'Staff ID, Target Amount, and Target Type are required' });
    }

    if (!validTargetTypes.includes(targetType)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ message: 'Target amount must be a positive number.' });
    }

    const updatedTarget = await StaffTarget.findByIdAndUpdate(
      id,
      { staffId, targetAmount, targetType },
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

// DELETE - remove a staff target by ID
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
