const users = [{ id: 1, name: 'Vasyl' }];

class UserModel {
  static async find() {
    return Promise.resolve(users);
  }

  static async create(newUserData) {
    return Promise.resolve(newUserData);
  }
}

module.exports = UserModel;
