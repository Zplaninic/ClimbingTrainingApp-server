import { Strength } from '../strength.model'
import mongoose from 'mongoose'

describe('Strength model', () => {
  describe('schema', () => {
    test('date', () => {
      const date = Strength.schema.obj.date
      expect(date).toEqual({
        type: String,
        default: ''
      })
    })

    test('muscles', () => {
      const muscles = Strength.schema.obj.muscles
      expect(muscles).toEqual({
        type: String,
        default: '',
        trim: true
      })
    })

    test('type', () => {
      const type = Strength.schema.obj.type
      expect(type).toEqual({
        type: String,
        default: '',
        trim: true
      })
    })

    test('sets', () => {
      const sets = Strength.schema.obj.sets
      expect(sets).toEqual({
        type: Number,
        default: 0,
        trim: true
      })
    })

    test('reps', () => {
      const reps = Strength.schema.obj.reps
      expect(reps).toEqual({
        type: Number,
        default: 0,
        trim: true
      })
    })

    test('rest', () => {
      const rest = Strength.schema.obj.rest
      expect(rest).toEqual({
        type: Number,
        default: 0,
        trim: true
      })
    })

    test('createdBy', () => {
      const createdBy = Strength.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })
  })
})
