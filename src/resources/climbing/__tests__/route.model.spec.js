import { Route } from '../route.model'
import mongoose from 'mongoose'

describe('Route model', () => {
  describe('schema', () => {
    test('date', () => {
      const date = Route.schema.obj.date
      expect(date).toEqual({
        type: String,
        default: ''
      })
    })

    test('name', () => {
      const name = Route.schema.obj.name
      expect(name).toEqual({
        type: String,
        trim: true,
        maxlength: 60,
        default: ''
      })
    })

    test('grade', () => {
      const grade = Route.schema.obj.grade
      expect(grade).toEqual({
        type: String,
        trim: true,
        maxlength: 10,
        default: ''
      })
    })

    test('movements', () => {
      const movements = Route.schema.obj.movements
      expect(movements).toEqual({
        type: String,
        default: ''
      })
    })

    test('type', () => {
      const type = Route.schema.obj.type
      expect(type).toEqual({
        type: String,
        required: true,
        enum: ['boulder', 'route'],
        default: 'boulder'
      })
    })

    test('rest', () => {
      const rest = Route.schema.obj.rest
      expect(rest).toEqual({
        type: String,
        default: ''
      })
    })

    test('createdBy', () => {
      const createdBy = Route.schema.obj.createdBy
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
      })
    })
  })
})
