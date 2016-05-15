/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* eslint no-param-reassign: ["error", { "props": false }] */
import { MongoClient, ObjectID } from 'mongodb';
import { generateHash, comparePassword } from './hash';
import config from '../../config';

let collection;

const getCollection = () =>
  new Promise((accept, reject) => {
    if (collection) {
      accept(collection);
    } else {
      MongoClient.connect(config.mongodb.url, (err, db) => {
        if (err) {
          reject(err);
        } else {
          collection = db.collection(config.mongodb.collection);
          accept(collection);
        }
      });
    }
  });

const fromMongo = (item) => {
  let result = item;
  if (Array.isArray(item) && item.length) {
    result = item[0];
  }
  result.id = result._id;
  delete result._id;
  return result;
};

const toMongo = (item) => {
  delete item.id;
  return item;
};

const create = (data) =>
  new Promise((accept, reject) => {
    getCollection().then(collection => {
      collection.insert(data, { w: 1 }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const actualResults = fromMongo(result.ops);
          accept(actualResults);
        }
      });
    });
  });

const read = (id) =>
  new Promise((accept, reject) => {
    getCollection().then(collection => {
      collection.findOne({ _id: new ObjectID(id) }, (err, result) => {
        if (err) {
          reject(err);
        } else if (!result) {
          reject({
            code: 404,
            message: 'Not found',
          });
        } else {
          accept(fromMongo(result));
        }
      });
    });
  });

const find = (query) =>
  new Promise((accept, reject) => {
    getCollection().then(collection => {
      collection.findOne(query, (err, result) => {
        if (err) {
          reject(err);
        } else if (!result) {
          reject({
            code: 404,
            message: 'Not found',
          });
        } else {
          accept(fromMongo(result));
        }
      });
    });
  });

const update = (id, data) =>
  new Promise((accept, reject) => {
    getCollection().then(collection => {
      collection.update(
        { _id: new ObjectID(id) },
        { $set: toMongo(data) },
        { w: 1 },
        (err) => {
          if (err) {
            return reject(err);
          }
          console.log(id);
          accept(read(id));
        }
      );
    });
  });

const register = async (userJson) => {
  const passwordHash = await generateHash(userJson.password);
  userJson.password = passwordHash;
  const user = await create(userJson);
  delete user.password;
  return user;
};

const getUserFromCredentials = async (username, password) => {
  const user = await find({ username });
  const verified = await comparePassword(password, user.password);
  if (!verified) {
    throw new Error('Incorrect password');
  }
  delete user.password;
  return user;
};

const getUserFromRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token missing');
  }
  const user = await find({ refreshToken });
  delete user.password;
  return user;
};

const saveRefreshToken = async (userId, refreshToken) => {
  if (!userId || !refreshToken) {
    throw new Error('Missing required parameter');
  }
  const user = await update(userId, { refreshToken });
  return user;
};

export {
  getUserFromCredentials,
  getUserFromRefreshToken,
  register,
  saveRefreshToken,
};
