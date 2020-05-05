import mongoose from 'mongoose'

const strengthSchema = new mongoose.Schema({
  date: {
    type: String,
    default: ''
  },
  muscles: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    default: '',
    trim: true
  },
  sets: {
    type: Number,
    default: 0,
    trim: true
  },
  reps: {
    type: Number,
    default: 0,
    trim: true
  },
  rest: {
    type: Number,
    default: 0,
    trim: true
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  }
})

export const Strength = mongoose.model('strength', strengthSchema)
