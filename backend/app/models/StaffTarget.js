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
}, { timestamps: true });

export default mongoose.model('StaffTarget', staffTargetSchema);
