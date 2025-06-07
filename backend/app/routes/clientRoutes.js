import express from 'express';
import Client from '../models/Client.js';

const router = express.Router();

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new client
router.post('/', async (req, res) => {
  try {
    const { name, age, mobile, address, dob, gender } = req.body;

    if (!name || !age || !mobile || !dob || !gender) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newClient = new Client({
      name,
      age,
      mobile,
      address,
      dob,
      gender,
    });

    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update existing client
router.put('/:id', async (req, res) => {
  try {
    const { name, age, mobile, address, dob, gender } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    client.name = name ?? client.name;
    client.age = age ?? client.age;
    client.mobile = mobile ?? client.mobile;
    client.address = address ?? client.address;
    client.dob = dob ?? client.dob;
    client.gender = gender ?? client.gender;

    await client.save();
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE client by ID
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
