import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import doctorRoutes from './app/routes/doctorRoutes.js';
import doctorTargetRoutes from "./app/routes/doctorTargets.js";
import clientRoutes from "./app/routes/clientRoutes.js";
import serviceRoutes from "./app/routes/serviceRoutes.js";
import billRoutes from "./app/routes/bills.js";
import appointmentsRoutes from "./app/routes/appointments.js";
import staffRoutes from "./app/routes/staffRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/doctors', doctorRoutes);
app.use('/api/targets', doctorTargetRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/staff', staffRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
