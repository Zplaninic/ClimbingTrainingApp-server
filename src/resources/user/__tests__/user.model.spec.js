import { User } from '../user.model'

describe('User model', () => {
  describe('schema', () => {
    test('email', () => {
      const email = User.schema.obj.email
      expect(email).toEqual({
        type: String,
        unique: true,
        required: true
      })
    })

    test('password', () => {
      const password = User.schema.obj.password
      expect(password).toEqual({
        type: String,
        required: true
      })
    })
  })
})
