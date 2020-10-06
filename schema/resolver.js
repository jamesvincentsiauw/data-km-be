/* eslint-disable max-len */
const {login, register, editProfile, verifyPassword} = require('./modules/authenticationController');
const {getCategory, addCategory, editCategory, deleteCategory} = require('./modules/categoryController');
const {getInfographic, addInfographic, editInfographic, deleteInfographic} = require('./modules/infographicController');

const resolver = {
  Query: {
    getCategory: async () => await getCategory(),
    getInfographic: async (parent, args) => await getInfographic(args),
  },
  Mutation: {
    // Authentication
    login: async (parent, args) => await login(args),
    register: async (parent, args) => await register(args),
    editProfile: async (parent, args) => await editProfile(args),
    verifyPassword: async (parent, args) => await verifyPassword(args),

    // Category
    addCategory: async (parent, args) => await addCategory(args),
    editCategory: async (parent, args) => await editCategory(args),
    deleteCategory: async (parent, args) => await deleteCategory(args),

    // Infographic
    addInfographic: async (parent, args) => await addInfographic(args),
    editInfographic: async (parent, args) => await editInfographic(args),
    deleteInfographic: async (parent, args) => await deleteInfographic(args),
  },
};

module.exports = resolver;
