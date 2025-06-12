import mongoose from 'mongoose';

const staffTargetSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  targetType: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'],
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('StaffTarget', staffTargetSchema);
