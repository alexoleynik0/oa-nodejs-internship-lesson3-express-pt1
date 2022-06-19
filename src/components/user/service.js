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

  static async findOneById(id) {
    return UserModel.find({ where: { id }, limit: 1 });
  }

  static async findOneByEmail(email) {
    return UserModel.find({ where: { email }, limit: 1 });
  }

  static async createOne(userData) {
    return UserModel.create(userData);
  }

  static async putOneById(id, userData) {
    return UserModel.updateById(id, userData);
  }

  static async patchOneById(id, userData) {
    const foundUser = await UserModel.find({ where: { id }, limit: 1 });
    if (foundUser === null) {
      return Promise.resolve(null);
    }
    return UserModel.updateById(id, { ...foundUser, ...userData });
  }

  static async removeOneById(id) {
    return UserModel.remove({ where: { id }, limit: 1 });
  }
}

module.exports = UserService;
