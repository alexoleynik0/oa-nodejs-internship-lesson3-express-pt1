const USERS_STORE_DEFAULT = [{ id: 1, name: 'Vasyl', email: 'vasyl@test.test' }];
let usersStore = [...USERS_STORE_DEFAULT];

// eslint-disable-next-line arrow-body-style
const modelFindFilterCb = (model, where) => {
  // eslint-disable-next-line arrow-body-style
  return Object.keys(where).every((conditionKey) => {
    // eslint-disable-next-line arrow-body-style
    return typeof model[conditionKey] !== 'undefined' && model[conditionKey] === where[conditionKey];
  });
};

class UserModel {
  static async find(options = {}) {
    let foundUsers = [...usersStore];
    if (options.where) {
      foundUsers = foundUsers.filter((user) => modelFindFilterCb(user, options.where));
    }
    if (options.limit) {
      foundUsers.length = Math.min(foundUsers.length, options.limit);
    }
    if (options.limit === 1) {
      return Promise.resolve(foundUsers.length > 0 ? foundUsers[0] : null);
    }
    return Promise.resolve(foundUsers);
  }

  static async create(userData) {
    const newUser = {
      ...userData,
      id: usersStore.length + 1, // IDEA: better id creation
    };
    usersStore = [...usersStore, newUser];
    return Promise.resolve(newUser);
  }

  static async updateById(id, userData) {
    const foundUser = await UserModel.find({ where: { id }, limit: 1 });
    if (foundUser === null) {
      return Promise.resolve(null);
    }
    const userDataPrepared = { ...userData, id };
    usersStore = usersStore.map((user) => (user.id === id ? userDataPrepared : user));
    return Promise.resolve(userDataPrepared);
  }

  static async remove(options) {
    const foundUser = await UserModel.find(options);
    if (foundUser !== null) {
      usersStore = usersStore.filter((user) => user.id !== foundUser.id);
    }
    return Promise.resolve(foundUser);
  }
}

module.exports = UserModel;
