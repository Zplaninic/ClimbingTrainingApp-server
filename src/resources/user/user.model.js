import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err)
    }

    this.password = hash
    next()
  })
})

userSchema.methods.comparePassword = function(candidatePassword) {
  const userHashedPassword = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, userHashedPassword, (err, isMatch) => {
      if (err) {
        reject(err)
      }

      resolve(isMatch)
    })
  })
}

export const User = mongoose.model('user', userSchema)
