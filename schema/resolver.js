/* eslint-disable max-len */
const {login, register, editProfile, verifyPassword} = require('./modules/auth');
const {getCategory} = require('./modules/category');

const resolver = {
  Query: {
    getCategory: async () => await getCategory(),
    getInfographics: () => {
      /* Function Goes Here */
    },
  },
  Mutation: {
    login: async (parent, args) => await login(args),
    register: async (parent, args) => await register(args),
    editProfile: async (parent, args) => await editProfile(args),
    verifyPassword: async (parent, args) => await verifyPassword(args),

    addInfographic: (parent, args) => {
      /* Function Goes Here */
    },

    editInfographic: (parent, args) => {
      /* Function Goes Here */
    },
  },
};

module.exports = resolver;
