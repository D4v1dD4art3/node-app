const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');

router.get('/', shopController.getIndex);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/products', shopController.getProducts);

router.get('/products/:idProduct', shopController.getProduct);

router.post('/cart', shopController.postCarts);

router.post('/cart-delete-item', shopController.postDeleteCartProduct);

// router.get('/checkout', shopController.getProducts);

module.exports = router;
