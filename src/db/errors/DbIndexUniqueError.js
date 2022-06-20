const DbError = require('./DbError');

class DbIndexUniqueError extends DbError {
  constructor(indexKey) {
    super(`DB key "${indexKey}" must be unique.`);
  }
}

module.exports = DbIndexUniqueError;
