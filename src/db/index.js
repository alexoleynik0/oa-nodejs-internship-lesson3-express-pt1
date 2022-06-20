// faux db

// helpers
module.exports.getCurrentDate = () => (new Date()).toJSON();
const getPrimaryKeyIndex = (model) => model.indexes.find((modelIndex) => modelIndex.primaryKey);

// models
const users = {
  data: [{
    id: 1, name: 'Vasyl', email: 'vasyl@test.com', createdAt: '2022-06-20T21:41:03.701Z', updatedAt: null,
  }, {
    id: 2, name: 'Stepan', email: 'stepan@test.com', createdAt: '2022-06-20T21:41:03.701Z', updatedAt: null,
  }],
  indexes: [
    {
      name: 'primaryKey_id',
      key: 'id',
      unique: true,
      primaryKey: true,
      currentValue: 1,
      getNextValue() {
        this.currentValue += 1;
        return this.currentValue;
      },
    },
    { name: 'email_unique', key: 'email', unique: true },
  ],
  getPrimaryKeyNextValue() {
    const primaryKey = getPrimaryKeyIndex(this);
    return primaryKey.getNextValue();
  },
};
module.exports.users = users;

const models = {
  users,
};
module.exports.models = models;

// set currentValue for primaryKey indexes
Object.keys(models).forEach((modelKey) => {
  const primaryKey = getPrimaryKeyIndex(models[modelKey]);
  primaryKey.currentValue = models[modelKey].data.at(-1)[primaryKey.key];
});
