const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: false,
  });
};

const postAddProduct = (req, res) => {
  //all values in req.body are strings
  //multipliying the price cast it to number
  req.body.price *= 100;

  const product = new Product(...Object.values(req.body));
  product
    .save()
    .then(result => {
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

const getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  if (!productId) {
    /*This should be replaced by an 
      error handling in the future*/
    return res.redirect('/');
  }
  let product = { id: 1, name: '', description: '', imageUrl: '', price: 0 };
  res.render('admin/add-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editMode: true,
    product: product,
  });
};

const postEditProduct = (req, res) => {
  const updatedProduct = req.body;
  res.redirect('/admin/product-list');
};

const postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  res.redirect('/admin/product-list');
};

const getProductList = (req, res, next) => {
  let products = [];
  res.render('admin/product-list', {
    productList: products,
    pageTitle: 'Admin Products',
    path: '/admin/product-list',
  });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  getProductList,
};
