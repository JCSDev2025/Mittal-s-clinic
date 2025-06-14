import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  qualification: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Removed salary field

const Staff = mongoose.model('Staff', staffSchema);
export default Staff;
