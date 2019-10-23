export default (paths, middleware) => {
  return (req, res, next) => {
    if (paths.indexOf(req.url) >= 0) {
      next()
    } else {
      middleware(req, res, next)
    }
  }
}
