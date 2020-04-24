import mongoose from 'mongoose'

const routeSchema = new mongoose.Schema({
  date: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    trim: true,
    maxlength: 60,
    default: ''
  },
  grade: {
    type: String,
    trim: true,
    maxlength: 10,
    default: ''
  },
  movements: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: true,
    enum: ['boulder', 'route'],
    default: 'boulder'
  },
  rest: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user',
    required: true
  }
})

export const Route = mongoose.model('route', routeSchema)
