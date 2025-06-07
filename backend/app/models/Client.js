import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1 },
  mobile: { type: String, required: true, trim: true, match: /^[0-9]{10}$/ },
  address: { type: String, trim: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
