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
  req.body.price = Math.round(req.body.price * 100);

  const product = new Product(...Object.values(req.body), req.user._id);
  product
    .save()
    .then(() => {
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
  Product.findById(productId)
    .then(product => {
      product.price = (product.price / 100).toFixed(2);
      res.render('admin/add-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode: true,
        product: product,
      });
    })
    .catch(err => console.log(err));
};

const postEditProduct = (req, res) => {
  const updatedProduct = req.body;
  updatedProduct.price = Math.round(updatedProduct.price * 100);
  const product = new Product(
    ...Object.values(updatedProduct),
    req.user._id,
    req.params.productId
  );
  product
    .save()
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

const postDeleteProduct = (req, res) => {
  const productId = req.body.productId;

  const cartProductIndex = req.user.cart.findIndex(cartProduct => {
    //cartProduct.productId is treated as a string but
    //it is not a string
    return cartProduct.productId.toString() === productId;
  });
  if (cartProductIndex >= 0) {
    req.user
      .removeFromCart(productId)
      .then(() => {
        return Product.deleteById(productId);
      })
      .then(() => {
        res.redirect('/admin/product-list');
      })
      .catch(err => console.log(err));
  } else {
    Product.deleteById(productId)
      .then(() => {
        res.redirect('/admin/product-list');
      })
      .catch(err => console.log(err));
  }
};

const getProductList = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      products.forEach(product => {
        product.price = (product.price / 100).toFixed(2);
      });
      res.render('admin/product-list', {
        productList: products,
        pageTitle: 'Admin Products',
        path: '/admin/product-list',
      });
    })
    .catch(err => console.log(err));
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
  getProductList,
};
