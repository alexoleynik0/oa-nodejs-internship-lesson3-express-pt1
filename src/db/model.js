const db = require('.');

// eslint-disable-next-line arrow-body-style
const modelFindFilterCb = (model, where) => {
  // eslint-disable-next-line arrow-body-style
  return Object.keys(where).every((conditionKey) => {
    // eslint-disable-next-line arrow-body-style
    return typeof model[conditionKey] !== 'undefined' && model[conditionKey] === where[conditionKey];
  });
};

const prepareCreatedModel = (modelKey, createData) => ({
  createdAt: db.getCurrentDate(),
  updatedAt: null, // NOTE: usually it sets current to but I don't see the use
  ...createData,
  id: db[modelKey].getPrimaryKeyNextValue(),
});

const prepareUpdatedModel = (model, updateData) => ({
  createdAt: model.createdAt,
  updatedAt: db.getCurrentDate(),
  ...updateData,
  id: model.id,
});

class Model {
  static modelKey = '';

  static async find(findOptions = {}) {
    let foundModels = [...db[this.modelKey].data];
    if (findOptions.where) {
      foundModels = foundModels.filter((model) => modelFindFilterCb(model, findOptions.where));
    }
    if (findOptions.limit) {
      foundModels.length = Math.min(foundModels.length, findOptions.limit);
    }
    if (findOptions.limit === 1) {
      return Promise.resolve(foundModels.length > 0 ? foundModels[0] : null);
    }
    return Promise.resolve(foundModels);
  }

  static async create(createData) {
    const createdModel = prepareCreatedModel(this.modelKey, createData);
    db[this.modelKey].data = [...db[this.modelKey].data, createdModel];
    return Promise.resolve(createdModel);
  }

  static async update(findOptions, updateData) {
    const found = await this.find(findOptions);
    if (found === null || found.length === 0) {
      return Promise.resolve(found);
    }
    if (found instanceof Array) {
      return this.updateMany({}, updateData, found);
    }
    return this.updateOne({}, updateData, found);
  }

  static async updateOne(findOptions, updateData, foundProp = null) {
    const found = foundProp !== null ? foundProp : await this.find({ ...findOptions, limit: 1 });
    if (found === null) {
      return Promise.resolve(found);
    }
    const updatedModel = prepareUpdatedModel(found, updateData);
    db[this.modelKey].data = db[this.modelKey].data.map(
      (model) => (model.id === found.id ? updatedModel : model),
    );
    return Promise.resolve(updatedModel);
  }

  static async updateMany(findOptions, updateData, foundArrayProp = null) {
    const foundArray = foundArrayProp !== null ? foundArrayProp : await this.find(findOptions);
    if (foundArray.length === 0) {
      return Promise.resolve(foundArray);
    }
    const foundArrayIDs = foundArray.map((model) => model.id);

    const updatedModels = [];
    db[this.modelKey].data = db[this.modelKey].data.map(
      (model) => {
        if (foundArrayIDs.indexOf(model.id) === -1) {
          return model;
        }
        const updatedModel = prepareUpdatedModel(model, updateData);
        updatedModels.push(updatedModel);
        return updatedModel;
      },
    );
    return Promise.resolve(updatedModels);
  }

  static async remove(findOptions) {
    const found = await this.find(findOptions);
    if (found === null || found.length === 0) {
      return Promise.resolve(found);
    }
    if (found instanceof Array) {
      return this.removeMany({}, found);
    }
    return this.removeOne({}, found);
  }

  static async removeOne(findOptions, foundProp = null) {
    const found = foundProp !== null ? foundProp : await this.find({ ...findOptions, limit: 1 });
    if (found === null) {
      return Promise.resolve(found);
    }
    db[this.modelKey].data = db[this.modelKey].data.filter((model) => model.id !== found.id);
    return Promise.resolve(found);
  }

  static async removeMany(findOptions, foundArrayProp = null) {
    const foundArray = foundArrayProp !== null ? foundArrayProp : await this.find(findOptions);
    if (foundArray.length === 0) {
      return Promise.resolve(foundArray);
    }
    const foundArrayIDs = foundArray.map((model) => model.id);

    db[this.modelKey].data = db[this.modelKey].data.filter(
      (model) => (foundArrayIDs.indexOf(model.id) === -1),
    );
    return Promise.resolve(foundArray);
  }
}

module.exports = Model;
