import mongoose from 'mongoose';


const patientSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        alias: 'patient_id',
        auto: true 
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {   
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

const doctorSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {   
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

const appointmentSchema = mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
    
});

const treatmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    estimated_sessions: { type: Number, required: false },
    description: { type: String, required: true },
    price: { type: Number, required: false },
});

export const Treatment = mongoose.model('Treatment', treatmentSchema, 'treatments');
export const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointments');
export const Patient = mongoose.model('Patient', patientSchema, 'patient_details');
export const Doctor = mongoose.model('Doctor', doctorSchema, 'doctor_details');

//module.exports = { Patient, Doctor, Appointment, Treatment };

