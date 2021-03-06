const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

class Product {
  constructor(name, imageUrl, description, price, userId, _id) {
    //Given that the following line do not work because this
    //reserved word is not recognized as a variable...
    //this = {this, ...{ name, imageUrl, description, price }
    //then, this is the most efficient way I found to implement
    //a constructor :D
    Object.assign(this, {
      name,
      imageUrl,
      description,
      price,
      userId,
      _id: _id ? new mongodb.ObjectID(_id) : null,
    });
  }
  save() {
    const db = getDb();
    if (this._id) {
      //Update the product
      return db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      return db.collection('products').insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(productId) {
    const db = getDb();

    return db
      .collection('products')
      .findOne({ _id: new mongodb.ObjectID(productId) })
      .then(product => {
        return product;
      })
      .catch(err => console.log(err));
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectID(productId) });
  }
}

module.exports = Product;
