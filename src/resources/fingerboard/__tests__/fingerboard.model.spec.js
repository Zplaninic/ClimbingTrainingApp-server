import { FingerBoard } from '../fingerboard.model'
import mongoose from 'mongoose'

describe('Fingerboard model', () => {
  describe('schema', () => {
    test('date', () => {
      const date = FingerBoard.schema.obj.date
      expect(date).toEqual({
        type: String,
        default: ''
      })
    })

    test('setsNumber', () => {
      const setsNumber = FingerBoard.schema.obj.setsNumber
      expect(setsNumber).toEqual({
        type: String,
        default: '',
        trim: true
      })
    })

    test('workInterval', () => {
      const workInterval = FingerBoard.schema.obj.workInterval
      expect(workInterval).toEqual({
        type: String,
        default: '',
        trim: true
      })
    })

    test('restInterval', () => {
      const restInterval = FingerBoard.schema.obj.restInterval
      expect(restInterval).toEqual({
        type: String,
        default: '',
        trim: true
      })
    })

    test('pauseBetweenSets', () => {
      const pauseBetweenSets = FingerBoard.schema.obj.pauseBetweenSets
      expect(pauseBetweenSets).toEqual({
        type: String,
        default: '',
        trim: true
      })
    })

    test('createdBy', () => {
      const createdBy = FingerBoard.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })
  })
})
