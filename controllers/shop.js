const Product = require('../models/product');

const getProductList = (req, res, next) => {
  let products = [];
  res.render('shop/product-list', {
    productList: products,
    pageTitle: 'Shop',
    path: '/product-list',
  });
};

const getUserCart = (req, res, next) => {
  let cartProducts = [];
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
    products: cartProducts,
    totalToPay: 0,
  });
};

const postDeleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  res.redirect('/cart');
};

const postUserCart = (req, res, next) => {
  const productId = req.body.productId;
  res.redirect('cart');
};

const postUserOrders = (req, res, next) => {
  res.redirect('/orders');
};

const getUserOrders = (req, res, next) => {
  let orders = [];
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
    orders,
    totalToPay: 0,
  });
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
  let product = { id: 1, name: '', description: '', imageUrl: '', price: 0 };
  res.render('shop/product-details', {
    product: product,
    pageTitle: product.name,
    path: '/product-list',
  });
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
