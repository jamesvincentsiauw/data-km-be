const { login } = require('./modules/auth');

const resolver = {
  Query: {
    getInfographics: () => {
      /* Function Goes Here */
    },
  },
  Mutation: {
    login: async (parent, args) => await login(args),

    addInfographic: (parent, args) => {
      /* Function Goes Here */
    },

    editInfographic: (parent, args) => {
      /* Function Goes Here */
    },
  },
};

module.exports = resolver;
