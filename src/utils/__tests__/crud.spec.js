import { setup } from '../testUtils'
import mongoose from 'mongoose'
import { Route } from '../../resources/climbing/route.model'
import { getOne, getMany, createOne, updateOne, removeOne } from '../crud'

describe('crud controllers', () => {
  describe('getOne', () => {
    test('must find a model and user, if not return 400', async () => {
      expect.assertions(3)

      const { req, res } = setup()

      const user = mongoose.Types.ObjectId()
      const modelId = mongoose.Types.ObjectId()

      req.user = { _id: user }
      req.params = { id: modelId }

      await getOne(Route)(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.end).toHaveBeenCalledTimes(1)
    })

    test('model and user find', async () => {
      expect.assertions(5)
      const { req, res } = setup()

      const user = mongoose.Types.ObjectId()
      const route = await Route.create({ name: 'route', createdBy: user })

      req.params = { id: route._id }
      req.user = { _id: user }

      await getOne(Route)(req, res)
      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)

      expect(res.json).toHaveBeenCalledTimes(1)
      const mockJson = res.json.mock.calls[0]
      const routeJson = mockJson[0]?.data

      expect(route._id.toString()).toBe(routeJson._id.toString())
      expect(route.toJSON()).toEqual(routeJson)
    })
  })

  describe('getMany', () => {
    test('finds array of docs by authenticated user', async () => {
      expect.assertions(6)
      const { req, res } = setup()
      const user = mongoose.Types.ObjectId()

      await Route.create(
        { name: 'route', createdBy: user },
        { name: 'route', createdBy: user },
        { name: 'route', createdBy: mongoose.Types.ObjectId() }
      )

      req.user = { _id: user }

      await getMany(Route)(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)

      expect(res.json).toHaveBeenCalledTimes(1)
      const mockJson = res.json.mock.calls[0]
      const routesJson = mockJson[0]?.data

      expect(routesJson).toHaveLength(2)
      routesJson.forEach(doc => {
        expect(`${doc.createdBy}`).toBe(`${user}`)
      })
    })
  })

  describe('createOne', () => {
    test('user must be autohorized', async () => {
      expect.assertions(3)

      const { req, res } = setup()
      const user = mongoose.Types.ObjectId()

      req.user = { _id: user }
      req.body = {
        name: 'route'
      }

      await createOne(Route)(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      const mockJson = res.json.mock.calls[0]
      const routesJson = mockJson[0]?.data

      expect(routesJson.createdBy).toBe(req.user._id)
    })
    test('create a new doc', async () => {
      expect.assertions(3)

      const { req, res } = setup()
      const user = mongoose.Types.ObjectId()

      req.user = { _id: user }
      req.body = {
        name: 'route'
      }

      await createOne(Route)(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)
      const mockJson = res.json.mock.calls[0]
      const routesJson = mockJson[0]?.data

      expect(routesJson.name).toBe(req.body.name)
    })
  })

  describe('updateOne', () => {
    test('find the document and update one', async () => {
      expect.assertions(4)
      const { res } = setup()
      const user = mongoose.Types.ObjectId()

      const route = await Route.create({ name: 'route', createdBy: user })

      const req = {
        user: { _id: user },
        body: { name: 'changed-name-route' },
        params: { id: route._id }
      }

      await updateOne(Route)(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)

      const mockJson = res.json.mock.calls[0]
      const routeJson = mockJson[0]?.data

      expect(routeJson.name).toBe(req.body.name)
      expect(routeJson._id.toString()).toBe(route._id.toString())
    })

    test('if no document, recieve 400', async () => {
      expect.assertions(3)
      const { res } = setup()

      const user = mongoose.Types.ObjectId()
      const req = {
        user: { _id: user },
        body: { name: 'someRoute' },
        params: { id: mongoose.Types.ObjectId() }
      }

      await updateOne(Route)(req, res)

      expect(res.send).toHaveBeenCalledTimes(1)
      expect(res.send).toHaveBeenCalledWith(400)
      expect(res.end).toHaveBeenCalledTimes(1)
    })
  })

  describe('removeOne', () => {
    test('if no documents recieve 400', async () => {
      expect.assertions(3)
      const { res } = setup()

      const user = mongoose.Types.ObjectId()
      const req = {
        user: { _id: user },
        body: { name: 'someRoute' },
        params: { id: mongoose.Types.ObjectId() }
      }

      await removeOne(Route)(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.end).toHaveBeenCalledTimes(1)
    })
    test('find the document and remove one', async () => {
      expect.assertions(3)
      const { res } = setup()

      const user = mongoose.Types.ObjectId()

      const route = await Route.create({ name: 'route', createdBy: user })

      const req = {
        params: { id: route._id },
        user: { _id: user }
      }

      await removeOne(Route)(req, res)

      expect(res.status).toHaveBeenCalledTimes(1)
      expect(res.status).toHaveBeenCalledWith(200)

      const mockJson = res.json.mock.calls[0]
      const routeJson = mockJson[0]?.data

      expect(routeJson._id.toString()).toBe(route._id.toString())
    })
  })
})
