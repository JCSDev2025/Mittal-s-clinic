import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contact: { type: String, required: true },
  service: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
