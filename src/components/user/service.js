const UserModel = require('./model');

class UserService {
  /**
   * @exports
   * @method findAll
   * @param {}
   * @summary get list of all users
   * @returns Promise<UserModel[]>
   */
  static async findAll() {
    return UserModel.find({});
  }

  static async create(newUserData) {
    return UserModel.create(newUserData);
  }
}

module.exports = UserService;
