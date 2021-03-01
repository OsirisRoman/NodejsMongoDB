const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.goToHome);
router.get('/product-list', shopController.getProductList);
router.get('/product-details/:productId', shopController.getProductDetails);
router.get('/cart', shopController.getUserCart);
router.post('/cart', shopController.postUserCart);
router.post(
  '/delete-product-from-cart',
  shopController.postDeleteProductFromCart
);
router.post('/create-order', shopController.postUserOrders);
router.get('/orders', shopController.getUserOrders);
router.get('/checkout', shopController.goToCheckout);

module.exports = router;
