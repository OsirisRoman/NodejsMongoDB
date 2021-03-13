const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

//The following warning was taken from mongoose official docs.
// Do not declare statics using ES6 arrow functions (=>).
// Arrow functions explicitly prevent binding this, so the
// above examples will not work because of the value of this.
userSchema.methods.addToCart = function (productIdToAdd) {
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
      productId: productIdToAdd,
      quantity: newQuantity,
    });
  }
  this.cart = updatedCart;
  return this.save();
};

//The following warning was taken from mongoose official docs.
// Do not declare statics using ES6 arrow functions (=>).
// Arrow functions explicitly prevent binding this, so the
// above examples will not work because of the value of this.
userSchema.methods.removeFromCart = function (productIdToRemove) {
  const updatedCart = this.cart.filter(
    product => product.productId.toString() !== productIdToRemove
  );
  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const { getDb } = require('../utils/database');

// class User {
//   constructor(_id, name, email, cart) {
//     Object.assign(this, { _id, name, email, cart });
//   }
//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   addToCart(productIdToAdd) {
//     const db = getDb();
//     const cartProductIndex = this.cart.findIndex(cartProduct => {
//       //cartProduct.productId is treated as a string but
//       //it is not a string
//       return cartProduct.productId.toString() === productIdToAdd;
//     });
//     let newQuantity = 1;
//     const updatedCart = [...this.cart];
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart[cartProductIndex].quantity + 1;
//       updatedCart[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCart.push({
//         productId: new mongodb.ObjectID(productIdToAdd),
//         quantity: newQuantity,
//       });
//     }

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectID(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//   removeFromCart(productIdToRemove) {
//     const db = getDb();
//     return db.collection('users').updateOne(
//       { _id: new mongodb.ObjectID(this._id) },
//       {
//         $set: {
//           cart: this.cart.filter(
//             product => product.productId.toString() !== productIdToRemove
//           ),
//         },
//       }
//     );
//   }

//   getCart() {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({
//         _id: {
//           $in: this.cart.map(product => product.productId),
//         },
//       })
//       .toArray()
//       .then(products => {
//         return products.map((product, index) => {
//           product.quantity = this.cart[index].quantity;
//           return product;
//         });
//       })
//       .catch(err => console.log(err));
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         return db.collection('orders').insertOne({
//           user: new mongodb.ObjectID(this._id),
//           products,
//           totalToPay: products.reduce((accumulator, currentValue) => {
//             return accumulator + currentValue.price * currentValue.quantity;
//           }, 0),
//         });
//       })
//       .then(() => {
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new mongodb.ObjectID(this._id) },
//             { $set: { cart: [] } }
//           );
//       })
//       .catch(err => console.log(err));
//   }

//   getOrders() {
//     const db = getDb();

//     return db
//       .collection('orders')
//       .find({ user: new mongodb.ObjectID(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection('users')
//       .findOne({ _id: new mongodb.ObjectID(userId) });
//   }
// }

// module.exports = User;
