// faux db

const users = [{
  id: 1, name: 'Vasyl', email: 'vasyl@test.test', createdAt: 1655722868839, updatedAt: null,
}, {
  id: 2, name: 'Stepan', email: 'stepan@test.test', createdAt: 1655722892493, updatedAt: null,
}];

const lastIDs = {
  users: users.at(-1).id,
};

// models
module.exports.users = users;

// helpers
module.exports.getNextID = (modelKey) => {
  lastIDs[modelKey] += 1;
  return lastIDs[modelKey];
};
module.exports.getCurrentTimestamp = () => Date.now();
