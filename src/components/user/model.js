const Model = require('../../db/model');

class UserModel extends Model {
  static modelKey = 'users';
}

module.exports = UserModel;
