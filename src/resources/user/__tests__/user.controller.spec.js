import { me } from '../user.controller'
import { setup } from '../../../utils/testUtils'

describe('user controllers', () => {
  test('has me controller that returns 200', () => {
    const { req, res } = setup()

    req.user = {
      email: 'hello123@hello.com',
      password: 'helllo1223'
    }

    me(req, res)

    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ data: req.user })
  })
})
