const { getDb } = require('../utils/database');

class Product {
  constructor(name, imageUrl, description, price) {
    //Given that the following line do not work because this
    //reserved word is not recognized as a variable...
    //this = {this, ...{ name, imageUrl, description, price }
    //then, this is the most efficient way I found to implement
    //a constructor :D
    Object.assign(this, { name, imageUrl, description, price });
  }
  save() {
    const db = getDb();
    return db.collection('products').insertOne(this);
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
