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
  const product = new Product({ ...req.body, user: req.user._id });

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
    //This should be replaced by an
    //error handling in the future
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
  Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

const postDeleteProduct = (req, res) => {
  const productId = req.body.productId;
  Product.findByIdAndRemove(productId)
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

const getProductList = (req, res, next) => {
  Product.find()
    // Select method allow us to know which fields of
    //our object we want to retrieve. In this case the
    //retrieved product will have name, price and _id
    //properties. In case we do not want the _id
    //property in our result, it can be achieved by
    //explicitly calling this format .select('name price -_id')

    //.select('name price')
    // Populate method insert the data relation in the
    //specified property, in this case user data inside
    //the user property, the second parameter filter the
    //properties of our relation we want to get, in this
    //case we are telling that we do not want all users
    //data, we just want its name and _id

    //.populate('user', 'name')
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
