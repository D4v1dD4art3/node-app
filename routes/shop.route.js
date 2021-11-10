const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:idProduct', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCarts);

router.post('/cart-delete-item', shopController.postDeleteCartProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

module.exports = router;
