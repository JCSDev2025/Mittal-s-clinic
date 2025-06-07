import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  assignedDoctor: { type: String, required: true },
  services: { type: String, required: true },
  totalSessions: { type: Number, required: true },
  sessionsCompleted: { type: Number, required: true },
  cost: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  date: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
