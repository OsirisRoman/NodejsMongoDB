const Product = require('../models/product');
const Order = require('../models/order');

const getProductList = (req, res, next) => {
  Product.find()
    .then(products => {
      products.forEach(product => {
        product.price = (product.price / 100).toFixed(2);
      });
      res.render('shop/product-list', {
        productList: products,
        pageTitle: 'Shop',
        path: '/product-list',
      });
    })
    .catch(err => console.log(err));
};

const getUserCart = (req, res, next) => {
  req.user
    .populate('cart.productId')
    .execPopulate()
    .then(populatedUser => {
      const cart = [];
      populatedUser.cart.forEach(product => {
        cart.push({
          _id: product.productId._id,
          name: product.productId.name,
          imageUrl: product.productId.imageUrl,
          description: product.productId.description,
          price: (product.productId.price / 100).toFixed(2),
          quantity: product.quantity,
        });
      });
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cart,
        totalToPay: (
          populatedUser.cart.reduce((accumulator, currentValue) => {
            return (
              accumulator + currentValue.productId.price * currentValue.quantity
            );
          }, 0) / 100
        ).toFixed(2),
      });
    })
    .catch(err => console.log(err));
};

const postDeleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.removeFromCart(productId).then(() => {
    res.redirect('/cart');
  });
};

const postUserCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .addToCart(productId)
    .then(() => {
      res.redirect('cart');
    })
    .catch(err => console.log(err));
};

const postUserOrders = (req, res, next) => {
  req.user
    .populate('cart.productId')
    .execPopulate()
    .then(populatedUser => {
      const cart = [];
      populatedUser.cart.forEach(product => {
        cart.push({
          name: product.productId.name,
          price: (product.productId.price / 100).toFixed(2),
          quantity: product.quantity,
        });
      });

      const order = new Order({
        products: cart,
        totalToPay: (
          populatedUser.cart.reduce((accumulator, currentValue) => {
            return (
              accumulator + currentValue.productId.price * currentValue.quantity
            );
          }, 0) / 100
        ).toFixed(2),
        user: req.user._id,
      });
      return order.save();
    })
    .then(() => {
      return req.user.resetCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

const getUserOrders = (req, res, next) => {
  Order.find()
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};

const goToCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'User Cart',
    path: '/checkout',
  });
};

const goToHome = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'User Landing Page',
    path: '/',
  });
};

const getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      product.price = (product.price / 100).toFixed(2);
      res.render('shop/product-details', {
        product: product,
        pageTitle: product.name,
        path: '/product-list',
      });
    })
    .catch(err => console.log(err));
};

module.exports = {
  getProductList,
  getUserCart,
  postUserCart,
  postDeleteProductFromCart,
  postUserOrders,
  getUserOrders,
  goToCheckout,
  goToHome,
  getProductDetails,
};
