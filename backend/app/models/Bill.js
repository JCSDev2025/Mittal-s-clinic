import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    assignedDoctor: { type: String, required: true },
    services: { type: String, required: true },
    totalSessions: { type: Number, required: true },
    sessionsCompleted: { type: Number, required: true },
    cost: { type: Number, required: false, default: 0 }, // Optional field
    totalAmount: { type: Number, required: false, default: 0 }, // New field for total cost including GST
    amountPaid: { type: Number, required: false, default: 0 }, // Optional field
    pendingAmount: { type: Number, required: false, default: 0 }, // Add new field for pending amount
    date: { type: Date, required: true },
    paymentMethod: { type: String, required: false, default: '' }, // Optional field
    notes: { type: String, required: false },
  },
  { timestamps: true }
);

const Bill = mongoose.model('Bill', billSchema);

export default Bill;