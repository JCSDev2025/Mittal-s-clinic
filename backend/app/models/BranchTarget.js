// models/BranchTarget.js
import mongoose from 'mongoose'; // Changed from require

const BranchTargetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount cannot be negative'],
  },
  period: {
    type: String,
    required: [true, 'Target period is required'],
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly'],
  },
  dateSet: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

export default mongoose.model('BranchTarget', BranchTargetSchema); // Changed from module.exports