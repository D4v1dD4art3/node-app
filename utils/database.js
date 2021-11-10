const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://v25798979D:SjNV2JvCEynwUCAQ@cluster0.e7urz.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'Not database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
