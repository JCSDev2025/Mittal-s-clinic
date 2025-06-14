// routes/branchTargetRoutes.js
import express from 'express'; // Changed from require
import BranchTarget from '../models/BranchTarget.js'; // Changed from require, and added .js extension

const router = express.Router();

// @desc    Get all branch targets
// @route   GET /api/branchtargets
// @access  Public (or Private, if authentication is implemented)
router.get('/', async (req, res) => {
  try {
    const targets = await BranchTarget.find({}).sort({ dateSet: -1 });
    res.status(200).json(targets);
  } catch (error) {
    console.error('Error fetching branch targets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new branch target
// @route   POST /api/branchtargets
// @access  Public (or Private)
router.post('/', async (req, res) => {
  const { amount, period } = req.body;

  if (!amount || !period) {
    return res.status(400).json({ message: 'Please provide both amount and period' });
  }

  try {
    const newTarget = new BranchTarget({
      amount,
      period,
    });
    const savedTarget = await newTarget.save();
    res.status(201).json(savedTarget);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error creating branch target:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a branch target by ID
// @route   PUT /api/branchtargets/:id
// @access  Public (or Private)
router.put('/:id', async (req, res) => {
  const { amount, period } = req.body;

  try {
    const target = await BranchTarget.findById(req.params.id);

    if (!target) {
      return res.status(404).json({ message: 'Branch target not found' });
    }

    target.amount = amount || target.amount;
    target.period = period || target.period;
    target.dateSet = new Date(); // Update dateSet on modification

    const updatedTarget = await target.save();
    res.status(200).json(updatedTarget);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid target ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error updating branch target:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a branch target by ID
// @route   DELETE /api/branchtargets/:id
// @access  Public (or Private)
router.delete('/:id', async (req, res) => {
  try {
    const target = await BranchTarget.findByIdAndDelete(req.params.id);

    if (!target) {
      return res.status(404).json({ message: 'Branch target not found' });
    }

    res.status(200).json({ message: 'Branch target deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid target ID' });
    }
    console.error('Error deleting branch target:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; // Changed from module.exports