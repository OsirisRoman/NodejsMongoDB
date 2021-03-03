const { MongoClient } = require('mongodb');

let _db;

const username = encodeURIComponent('Osiris');
const password = encodeURIComponent('1724771645');
const database = 'test';
const url = `mongodb+srv://${username}:${password}@cluster0.7jlvx.mongodb.net/${database}?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`;

const mongoConnect = myCallback => {
  MongoClient.connect(url)
    .then(client => {
      console.log('Connected to MongoDB!!');
      _db = client.db();
      myCallback();
    })
    .catch(err => {
      console.log('No Connected!!');
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database found';
};

module.exports = {
  mongoConnect,
  getDb,
};
