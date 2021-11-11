const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();
const isAuth = require('../middleware/is-auth.middleware');

// GET methods =>
router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProducts);

// // Post methods =>
router.post('/add-product', isAuth, adminController.postAddProducts);

router.get('/edit-product/:idProduct', isAuth, adminController.getEditProducts);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);
module.exports = router;
