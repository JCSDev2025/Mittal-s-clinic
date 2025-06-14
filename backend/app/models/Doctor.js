import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  experience: { type: Number, required: true, min: 0 },
  qualification: { type: String, required: true, trim: true },
  availability: { type: String, required: true, trim: true },
}, { timestamps: true }); // Removed salary field

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;