export function setup() {
  const req = {
    body: {}
  }
  const res = {}
  const next = jest.fn()
  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this
      }.bind(res)
    ),
    json: jest.fn(
      function json() {
        return this
      }.bind(res)
    ),
    send: jest.fn(
      function send() {
        return this
      }.bind(res)
    ),
    cookie: jest.fn(
      function cookie() {
        return this
      }.bind(res)
    ),
    sendStatus: jest.fn(
      function sendStatus() {
        return this
      }.bind(res)
    ),
    end: jest.fn(
      function end() {
        return this
      }.bind(res)
    )
  })
  return { req, res, next }
}
