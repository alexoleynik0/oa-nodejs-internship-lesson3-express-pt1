// simple req.params.id changer {@see http://expressjs.com/en/5x/api.html#app.param}
module.exports = (req, _res, next, value, key) => {
  // NOTE: no need to check `isNaN(req.params.id)` bc only numeric accepted by route regexp.
  req.params[key] = parseInt(value, 10);
  next();
};
