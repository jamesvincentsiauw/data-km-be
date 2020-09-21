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
    throw new Error('No Documents Found in DB');
  }
};

module.exports = {
  getCategory,
};
