/* eslint-disable guard-for-in */
/* eslint-disable max-len */
require('dotenv').config();
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcrypt');
const BCRYPT_SALT = 10;
const db = new PouchDB(process.env.COUCH_STAGING+'user', {skip_setup: true});

const login = async (params) => {
  const username = params.username;
  const password = params.password;

  // Get User From DB
  const doc = await db.find({
    selector: {
      username: {
        $eq: username,
      },
    },
  });

  if (doc.docs.length > 0) {
    const selectedUser = doc.docs[0];

    // Comparing Hashed Password with Given Paswword
    const match = await bcrypt.compare(password, selectedUser.password).catch((err) => {
      throw new Error(err);
    });

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
      throw new Error('password error');
    }
  } else {
    throw new Error('username error');
  }
};

const register = async (params) => {
  const username = params.username;
  const password = await bcrypt.hash(params.password, BCRYPT_SALT);
  const email = params.email;
  const role = params.role === undefined ? 'admin' : params.role;

  // Check Existing User in DB
  const doc = await db.find({
    selector: {
      $or: [
        {username: {$eq: username}},
        {email: {$eq: email}},
      ],
    },
  });

  if (doc.docs.length > 0) {
    throw new Error('Invalid Credential');
  } else {
    //  Preparing Data Payload
    const payload = {
      username: username,
      password: password,
      email: email,
      role: role,
      createdAt: moment().format(),
      updatedAt: moment().format(),
    };

    // Create New Document to DB
    const newDoc = await db.post(payload);
    if (newDoc.ok) {
      const retval = {
        message: 'New User Created',
      };

      return retval;
    } else {
      throw new Error('Error When Creating Document. Try Again Later!');
    }
  }
};

const editProfile = async (params) => {
  const username = params.username;
  const newProfile = params.profile;

  // Get User From DB
  const doc = await db.find({
    selector: {
      username: {
        $eq: username,
      },
    },
  });

  if (doc.docs.length > 0) {
    // Iterate to Automatically Edit Data
    for (item in newProfile) {
      // Change Password Handling
      if (item === 'password') {
        doc.docs[0][item] = await bcrypt.hash(newProfile[item], BCRYPT_SALT);
      } else {
        doc.docs[0][item] = newProfile[item];
      }
    }
    doc.docs[0].updatedAt = moment().format();

    // Put new Data to DB
    const editDoc = await db.put(doc.docs[0]);
    if (editDoc.ok) {
      const retval = {
        message: 'User Profile Edited',
      };

      return retval;
    } else {
      throw new Error('Error When Editing Document. Try Again Later!');
    }
  }
};

const verifyToken = (accessToken) => {
  try {
    // Verify Given Access Token
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userLoggedIn = {
      status: true,
      user: decodedToken,
      message: 'success',
    };

    return userLoggedIn;
  } catch (err) {
    const userLoggedIn = {
      status: false,
      user: null,
      message: err.message,
    };
    return userLoggedIn;
  }
};

module.exports = {
  login,
  register,
  editProfile,
  verifyToken,
};
