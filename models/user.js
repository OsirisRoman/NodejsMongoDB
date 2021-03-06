const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

class User {
  constructor(_id, name, email, cart) {
    Object.assign(this, { _id, name, email, cart });
  }
  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(productIdToAdd) {
    const db = getDb();
    const cartProductIndex = this.cart.findIndex(cartProduct => {
      //cartProduct.productId is treated as a string but
      //it is not a string
      return cartProduct.productId.toString() === productIdToAdd;
    });
    let newQuantity = 1;
    const updatedCart = [...this.cart];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart[cartProductIndex].quantity + 1;
      updatedCart[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCart.push({
        productId: new mongodb.ObjectID(productIdToAdd),
        quantity: newQuantity,
      });
    }

    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    return db
      .collection('products')
      .find({
        _id: {
          $in: this.cart.map(product => product.productId),
        },
      })
      .toArray()
      .then(products => {
        return products.map((product, index) => {
          product.quantity = this.cart[index].quantity;
          return product;
        });
      })
      .catch(err => console.log(err));
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectID(userId) });
  }
}

module.exports = User;
