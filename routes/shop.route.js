const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const isAuth = require('../middleware/is-auth.middleware');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:idProduct', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCarts);

router.post('/cart-delete-item', isAuth, shopController.postDeleteCartProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;
