const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

// GET methods =>
router.get('/products', adminController.getProducts);
router.get('/add-product', adminController.getAddProducts);

// Post methods =>
router.post('/add-product', adminController.postAddProducts);

router.get('/edit-product/:idProduct', adminController.getEditProducts);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);
module.exports = router;
