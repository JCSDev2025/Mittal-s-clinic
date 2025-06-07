import mongoose from 'mongoose';

const doctorTargetSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
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

export default mongoose.model('DoctorTarget', doctorTargetSchema);
