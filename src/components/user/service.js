const UserModel = require('./model');

class UserService {
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
    return UserModel.update({ where: { id }, limit: 1 }, userData);
  }

  static async patchOneById(id, userData) {
    const found = await UserModel.find({ where: { id }, limit: 1 });
    if (found === null) {
      return Promise.resolve(found);
    }
    return UserModel.updateOne({}, { ...found, ...userData }, found);
  }

  static async removeOneById(id) {
    return UserModel.remove({ where: { id }, limit: 1 });
  }
}

module.exports = UserService;
