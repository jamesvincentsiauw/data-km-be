/* eslint-disable guard-for-in */
/* eslint-disable max-len */
require('dotenv').config();
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const moment = require('moment');
const db = new PouchDB(process.env.COUCH_STAGING+'dataset', {skip_setup: true});

const getDataset = async (params) => {
  const {id, name} = params;

  if (id !== undefined || name !== undefined) {
    const doc = await db.find({
      selector: {
        $or: [
          {id: {$eq: id}},
          {name: {$eq: name}},
        ],
      },
    });

    if (doc.docs.length > 0) {
      return doc.docs;
    } else {
      throw new Error('No Documents Found.');
    }
  } else {
    const allDataset = [];
    const doc = await db.allDocs({include_docs: true});

    if (doc.total_rows > 0) {
      // Iterate List to Get Each Doc
      for (const item of doc.rows) {
        const DatasetItem = {
          id: item.id,
          name: item.doc.name,
          author: item.doc.author,
          category: item.doc.category,
        };
        // Push Prepared Data
        allDataset.push(DatasetItem);
      }

      return allDataset;
    } else {
      throw new Error('No Documents Found.');
    }
  };
};

const addDataset = async (params) => {
  const {name, author, category} = params;

  // Check Data in DB
  const doc = await db.find({
    selector: {
      name: {$eq: name},
    },
  });

  if (doc.docs.length > 0) {
    throw new Error('Name Unavailable');
  } else {
    const payload = {
      name: name,
      author: author,
      category: category,
      createdAt: moment().format(),
      updatedAt: moment().format(),
    };

    // Store New Dataset
    const newDataset = await db.post(payload);
    if (newDataset.ok) {
      const retval = {
        message: 'New Dataset Stored',
      };

      return retval;
    } else {
      throw new Error('Error When Creating Document. Try Again Later!');
    }
  }
};

const editDataset = async (params) => {
  const {name, data} = params;

  // Get Dataset From DB
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
        message: 'Dataset Edited',
      };

      return retval;
    } else {
      throw new Error('Error When Editing Document. Try Again Later!');
    }
  } else {
    throw new Error('No Documents Found.');
  }
};

const deleteDataset = async (params) => {
  const {name} = params;

  // Get Data from DB
  const doc = await db.find({
    selector: {
      name: {$eq: name},
    },
  });

  if (doc.docs.length > 0) {
    const selectedDataset = doc.docs[0];
    const removeDoc = await db.remove(selectedDataset._id, selectedDataset._rev);

    if (removeDoc.ok) {
      const retval = {
        message: 'Dataset Deleted',
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
  getDataset,
  addDataset,
  editDataset,
  deleteDataset,
};
