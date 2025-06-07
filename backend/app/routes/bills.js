// backend/routes/bills.js
import express from 'express';
import Bill from '../models/Bill.js';

const router = express.Router();

// CREATE a new bill
router.post('/', async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single bill
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a bill
router.put('/:id', async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a bill
router.delete('/:id', async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
