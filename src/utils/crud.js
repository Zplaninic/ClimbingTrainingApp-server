export const getOne = model => async (req, res) => {
  try {
    const doc = await model
      .findOne({
        createdBy: req.user._id,
        _id: req.params.id
      })
      .lean()
      .exec()

    if (!doc) {
      return res.status(400).end()
    }
    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
export const getMany = model => async (req, res) => {
  try {
    const doc = await model
      .find({ createdBy: req.user._id })
      .lean()
      .exec()

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.send(400).end()
  }
}

export const createOne = model => async (req, res) => {
  const createdBy = req.user._id
  try {
    const doc = await model.create({
      ...req.body,
      createdBy
    })
    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.send(400).end()
  }
}

export const updateOne = model => async (req, res) => {
  try {
    const doc = await model.findOneAndUpdate(
      {
        createdBy: req.user._id,
        _id: req.params.id
      },
      req.body,
      { new: true }
    )

    if (!doc) {
      return res.send(400).end()
    }
    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.send(400).end()
  }
}

export const removeOne = model => async (req, res) => {
  try {
    const doc = await model.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    })

    if (!doc) {
      return res.send(400).end()
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    console.error(e)
    res.send(400).end()
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
