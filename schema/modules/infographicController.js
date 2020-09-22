/* eslint-disable max-len */
require('dotenv').config();
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const moment = require('moment');
const db = new PouchDB(process.env.COUCH_STAGING+'infographic', {skip_setup: true});

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

module.exports = {
  getInfographic,
};
