/* eslint-disable guard-for-in */
/* eslint-disable max-len */
require('dotenv').config();
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const moment = require('moment');
const db = new PouchDB(process.env.COUCH_STAGING+'category', {skip_setup: true});

const getCategory = async () => {
  // Get All Data from DB
  const allRows = await db.allDocs({include_docs: true});
  // Initialize Empty List to Filter Data
  const allCategory = [];

  if (allRows.total_rows > 0) {
    // Iterate List to Get Each Doc
    for (const item of allRows.rows) {
      const categoryItem = {
        id: item.id,
        name: item.doc.name,
        cover: item.doc.cover,
      };
      // Push Prepared Data
      allCategory.push(categoryItem);
    }

    return allCategory;
  } else {
    throw new Error('No Documents Found.');
  }
};


const addCategory = async (params) => {
  const {name, cover} = params;

  // Check Doc in DB
  const doc = await db.find({
    selector: {
      name: {$eq: name},
    },
  });

  if (doc.docs.length > 0) {
    throw new Error('Category Found in DB. Try Again!');
  } else {
    const payload = {
      name: name,
      cover: cover,
      createdAt: moment().format(),
      updatedAt: moment().format(),
    };

    // Add New Category
    const newCategory = await db.post(payload);
    if (newCategory.ok) {
      const retval = {
        message: 'New Category Created',
      };

      return retval;
    } else {
      throw new Error('Error When Creating Document. Try Again Later!');
    }
  }
};

const editCategory = async (params) => {
  const {name, data} = params;

  // Get Category From DB
  const doc = await db.find({
    selector: {
      name: {$eq: name},
    },
  });

  if (doc.docs.length > 0) {
    // Iterate to Automatically Edit Data
    for (item in data) {
      doc.docs[0][item] = data[item];
    }
    doc.docs[0].updatedAt = moment().format();

    // Put new Data to DB
    const editDoc = await db.put(doc.docs[0]);
    if (editDoc.ok) {
      const retval = {
        message: 'Category Edited',
      };

      return retval;
    } else {
      throw new Error('Error When Editing Document. Try Again Later!');
    }
  } else {
    throw new Error('No Documents Found.');
  }
};

const deleteCategory = async (params) => {
  const {name} = params;

  // Get Data from DB
  const doc = await db.find({
    selector: {
      name: {$eq: name},
    },
  });

  if (doc.docs.length > 0) {
    const selectedCategory = doc.docs[0];
    const removeDoc = await db.remove(selectedCategory._id, selectedCategory._rev);

    if (removeDoc.ok) {
      const retval = {
        message: 'Category Deleted',
      };

      return retval;
    } else {
      throw new Error('Error When Deleting Document. Try Again Later!');
    };
  } else {
    throw new Error('No Documents Found.');
  }
};

module.exports = {
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
