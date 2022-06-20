const db = require('.');
const DbIndexUniqueError = require('./errors/DbIndexUniqueError');

// eslint-disable-next-line arrow-body-style
const modelFindFilterWhereCb = (model, where) => {
  // eslint-disable-next-line arrow-body-style
  return Object.keys(where).every((conditionKey) => {
    // eslint-disable-next-line arrow-body-style
    return typeof model[conditionKey] !== 'undefined' && model[conditionKey] === where[conditionKey];
  });
};

// eslint-disable-next-line arrow-body-style
const modelFindFilterWhereNotCb = (model, whereNot) => {
  // eslint-disable-next-line arrow-body-style
  return Object.keys(whereNot).every((conditionKey) => {
    // eslint-disable-next-line arrow-body-style
    return typeof model[conditionKey] === 'undefined' || model[conditionKey] !== whereNot[conditionKey];
  });
};

class Model {
  static modelKey = '';

  // "public" static methods

  static async find(findOptions = {}) {
    let foundModels = [...db[this.modelKey].data];
    if (typeof findOptions.where !== 'undefined') {
      // NOTE: only positive "AND" where
      foundModels = foundModels.filter(
        (model) => modelFindFilterWhereCb(model, findOptions.where),
      );
    }
    if (typeof findOptions.whereNot !== 'undefined') {
      // NOTE: only negative "AND" where
      foundModels = foundModels.filter(
        (model) => modelFindFilterWhereNotCb(model, findOptions.whereNot),
      );
    }
    if (typeof findOptions.limit === 'number') {
      foundModels.length = Math.min(foundModels.length, findOptions.limit);
    }
    if (findOptions.limit === 1) {
      return Promise.resolve(foundModels.length > 0 ? foundModels[0] : null);
    }
    return Promise.resolve(foundModels);
  }

  static async create(createData) {
    const createdModel = this.prepareCreatedModel(createData);
    await this.checkIndexes(createdModel);
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
    const updatedModel = this.prepareUpdatedModel(found, updateData);
    await this.checkIndexes(updatedModel, { whereNot: { id: found.id } });
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
      async (model) => {
        if (foundArrayIDs.indexOf(model.id) === -1) {
          return model;
        }
        const updatedModel = this.prepareUpdatedModel(model, updateData);
        await this.checkIndexes(updatedModel, { whereNot: { id: model.id } });

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

  // "private" helpers

  static prepareCreatedModel(createData) {
    return {
      createdAt: db.getCurrentDate(),
      updatedAt: null, // NOTE: usually it sets current to but I don't see the use
      ...createData,
      id: db[this.modelKey].getPrimaryKeyNextValue(),
    };
  }

  static prepareUpdatedModel(model, updateData) {
    return {
      createdAt: model.createdAt,
      updatedAt: db.getCurrentDate(),
      ...updateData,
      id: model.id,
    };
  }

  static async checkIndexes(modelData, findOptions = {}) {
    const uniqueKeys = [];
    const uniquePromises = [];
    for (let i = 0; i < db[this.modelKey].indexes.length; i += 1) {
      const modelIndex = db[this.modelKey].indexes[i];
      if (modelIndex.unique === true) {
        uniqueKeys.push(modelIndex.key);
        uniquePromises.push(
          this.find({ where: { [modelIndex.key]: modelData[modelIndex.key] }, ...findOptions }),
        );
      }
    }
    const uniquePromisesResults = await Promise.all(uniquePromises);
    uniquePromisesResults.forEach((uniquePromiseResult, uniquePromiseResultIndex) => {
      if (uniquePromiseResult.length > 0) {
        throw new DbIndexUniqueError(uniqueKeys[uniquePromiseResultIndex]);
      }
    });
  }
}

module.exports = Model;
