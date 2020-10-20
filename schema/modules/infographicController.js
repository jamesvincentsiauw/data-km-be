/* eslint-disable guard-for-in */
/* eslint-disable max-len */
require('dotenv').config();
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const moment = require('moment');
const db = new PouchDB('http://'+process.env.COUCH_CREDENTIAL+'@'+process.env.COUCH_STAGING+'/infographic', {skip_setup: true});

const getInfographic = async (params) => {
  const {id, title} = params;

  if (id !== undefined || title !== undefined) {
    const doc = await db.find({
      selector: {
        $or: [
          {id: {$eq: id}},
          {title: {$eq: title}},
        ],
      },
    });

    if (doc.docs.length > 0) {
      return doc.docs;
    } else {
      throw new Error('No Documents Found.');
    }
  } else {
    const allInfographic = [];
    const doc = await db.allDocs({include_docs: true});

    if (doc.total_rows > 0) {
      // Iterate List to Get Each Doc
      for (const item of doc.rows) {
        const InfographicItem = {
          id: item.id,
          title: item.doc.title,
          author: item.doc.author,
          shortDescription: item.doc.shortDescription,
          readingTime: item.doc.readingTime,
        };
        // Push Prepared Data
        allInfographic.push(InfographicItem);
      }

      return allInfographic;
    } else {
      throw new Error('No Documents Found.');
    }
  };
};

const addInfographic = async (params) => {
  const {title, author, shortDescription, readingTime} = params;

  // Check Data in DB
  const doc = await db.find({
    selector: {
      title: {$eq: title},
    },
  });

  if (doc.docs.length > 0) {
    throw new Error('Title Unavailable');
  } else {
    const payload = {
      title: title,
      author: author,
      shortDescription: shortDescription,
      readingTime: readingTime,
      createdAt: moment().format(),
      updatedAt: moment().format(),
    };

    // Store New Infographic
    const newInfographic = await db.post(payload);
    if (newInfographic.ok) {
      const retval = {
        message: 'New Infographic Stored',
      };

      return retval;
    } else {
      throw new Error('Error When Creating Document. Try Again Later!');
    }
  }
};

const editInfographic = async (params) => {
  const {title, data} = params;

  // Get Infographic From DB
  const doc = await db.find({
    selector: {
      title: {$eq: title},
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
        message: 'Infographic Edited',
      };

      return retval;
    } else {
      throw new Error('Error When Editing Document. Try Again Later!');
    }
  } else {
    throw new Error('No Documents Found.');
  }
};

const deleteInfographic = async (params) => {
  const {title} = params;

  // Get Data from DB
  const doc = await db.find({
    selector: {
      title: {$eq: title},
    },
  });

  if (doc.docs.length > 0) {
    const selectedInfographic = doc.docs[0];
    const removeDoc = await db.remove(selectedInfographic._id, selectedInfographic._rev);

    if (removeDoc.ok) {
      const retval = {
        message: 'Infographic Deleted',
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
  getInfographic,
  addInfographic,
  editInfographic,
  deleteInfographic,
};
