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

//The following warning was taken from mongoose official docs.
// Do not declare statics using ES6 arrow functions (=>).
// Arrow functions explicitly prevent binding this, so the
// above examples will not work because of the value of this.
userSchema.methods.resetCart = function () {
  this.cart = [];
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
