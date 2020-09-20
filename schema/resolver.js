const {login, register, editProfile} = require('./modules/auth');

const resolver = {
  Query: {
    getInfographics: () => {
      /* Function Goes Here */
    },
  },
  Mutation: {
    login: async (parent, args) => await login(args),
    register: async (parent, args) => await register(args),
    editProfile: async (parent, args) => await editProfile(args),

    addInfographic: (parent, args) => {
      /* Function Goes Here */
    },

    editInfographic: (parent, args) => {
      /* Function Goes Here */
    },
  },
};

module.exports = resolver;
