import express from 'express';
import Staff from '../models/Staff.js';

const router = express.Router();

// GET all staff members
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// POST new staff member
router.post('/', async (req, res) => {
  const { name, role, phone, experience, qualification, salary } = req.body;

  if (!name || !role || !phone || experience == null || !qualification || salary == null) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newStaff = new Staff({ name, role, phone, experience, qualification, salary });
    const savedStaff = await newStaff.save();
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add staff member' });
  }
});

// PUT update staff member
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, phone, experience, qualification, salary } = req.body;

  try {
    const updated = await Staff.findByIdAndUpdate(
      id,
      { name, role, phone, experience, qualification, salary },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Staff not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// DELETE staff member
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Staff.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Staff not found' });
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
});

export default router;
