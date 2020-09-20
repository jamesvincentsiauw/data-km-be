/* eslint-disable max-len */
require('dotenv').config();
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = new PouchDB(process.env.COUCH_STAGING+'user', {skip_setup: true});

const login = async (params) => {
  username = params.username;
  password = params.password;

  // Get User From DB
  const doc = await db.find({
    selector: {
      username: {
        $eq: username,
      },
    },
  });

  if (doc) {
    const selectedUser = doc.docs[0];

    // Comparing Hashed Password with Given Paswword
    const match = await bcrypt.compare(password, selectedUser.password);

    if (match) {
      // Signing JWT to Authenticated User
      accessToken = await jwt.sign({user: selectedUser}, process.env.JWT_SECRET, {expiresIn: '12h'});

      const retval = {
        access_token: accessToken,
        message: 'success',
        user: {
          username: selectedUser.username,
          name: selectedUser.name,
          role: selectedUser.role,
        },
      };

      return retval;
    } else {
      const retval = {
        access_token: null,
        message: 'password error',
        user: null,
      };

      return retval;
    }
  } else {
    const retval = {
      access_token: null,
      message: 'username error',
      user: null,
    };

    return retval;
  }
};

module.exports = {
  login,
};
