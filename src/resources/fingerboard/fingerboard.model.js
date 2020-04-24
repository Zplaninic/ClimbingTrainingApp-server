import mongoose from 'mongoose'

const fingerBoardSchema = new mongoose.Schema({
  date: {
    type: String,
    default: ''
  },
  setsNumber: {
    type: String,
    default: '',
    trim: true
  },
  workInterval: {
    type: String,
    default: '',
    trim: true
  },
  restInterval: {
    type: String,
    default: '',
    trim: true
  },
  pauseBetweenSets: {
    type: String,
    default: '',
    trim: true
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  }
})

export const FingerBoard = mongoose.model('fingerboard', fingerBoardSchema)
