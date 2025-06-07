// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sessions: { type: Number, required: true },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
