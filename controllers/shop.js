const Product = require('../models/product');

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
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
    products: [],
    totalToPay: 0,
  });
  /* req.user.getCart().then(cartProducts => {
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products: cartProducts,
      totalToPay: (
        cartProducts.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.price * currentValue.quantity;
        }, 0) / 100
      ).toFixed(2),
    });
  }); */
};

const postDeleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  res.redirect('/cart');
  /* req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err)); */
};

const postUserCart = (req, res, next) => {
  const productId = req.body.productId;
  res.redirect('cart');
  /* req.user
    .addToCart(productId)
    .then(() => {
      res.redirect('cart');
    })
    .catch(err => console.log(err)); */
};

const postUserOrders = (req, res, next) => {
  res.redirect('/orders');
  /* req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err)); */
};

const getUserOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
    orders: [],
  });
  /* req.user.getOrders().then(orders => {
    orders.forEach(order => {
      order.totalToPay = (order.totalToPay / 100).toFixed(2);
    });
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders,
    });
  }); */
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
