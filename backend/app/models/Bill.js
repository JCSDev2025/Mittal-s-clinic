import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    assignedStaff: { type: String, required: true }, // Changed from assignedDoctor to assignedStaff
    services: { type: String, required: true },
    totalSessions: { type: Number, required: true },
    sessionsCompleted: { type: Number, required: true },
    cost: { type: Number, required: false, default: 0 },
    totalAmount: { type: Number, required: false, default: 0 },
    amountPaid: { type: Number, required: false, default: 0 },
    pendingAmount: { type: Number, required: false, default: 0 },
    date: { type: Date, required: true },
    paymentMethod: { type: String, required: false, default: '' },
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

const Bill = mongoose.model('Bill', billSchema);

export default Bill;