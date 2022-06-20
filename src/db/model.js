const db = require('.');

// eslint-disable-next-line arrow-body-style
const modelFindFilterCb = (model, where) => {
  // eslint-disable-next-line arrow-body-style
  return Object.keys(where).every((conditionKey) => {
    // eslint-disable-next-line arrow-body-style
    return typeof model[conditionKey] !== 'undefined' && model[conditionKey] === where[conditionKey];
  });
};

class Model {
  static modelKey = '';

  static async find(options = {}) {
    let foundModels = [...db[this.modelKey]];
    if (options.where) {
      foundModels = foundModels.filter((model) => modelFindFilterCb(model, options.where));
    }
    if (options.limit) {
      foundModels.length = Math.min(foundModels.length, options.limit);
    }
    if (options.limit === 1) {
      return Promise.resolve(foundModels.length > 0 ? foundModels[0] : null);
    }
    return Promise.resolve(foundModels);
  }

  static async create(createData) {
    const newModel = {
      ...createData,
      id: db.getNextID(this.modelKey),
      createdAt: db.getCurrentTimestamp(),
    };
    db[this.modelKey] = [...db[this.modelKey], newModel];
    return Promise.resolve(newModel);
  }

  static async updateById(id, updateData) {
    const foundModel = await this.find({ where: { id }, limit: 1 });
    if (foundModel === null) {
      return Promise.resolve(null);
    }
    const updatedModel = {
      ...updateData,
      id,
      createdAt: foundModel.createdAt,
      updatedAt: db.getCurrentTimestamp(),
    };
    db[this.modelKey] = db[this.modelKey].map((model) => (model.id === id ? updatedModel : model));
    return Promise.resolve(updatedModel);
  }

  static async remove(options) {
    const foundModel = await this.find(options);
    if (foundModel !== null) {
      db[this.modelKey] = db[this.modelKey].filter((user) => user.id !== foundModel.id);
    }
    return Promise.resolve(foundModel);
  }
}

module.exports = Model;
