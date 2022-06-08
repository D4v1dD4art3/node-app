const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();
const isAuth = require('../middleware/is-auth.middleware');
const { body } = require('express-validator');

// GET methods =>
router.get('/products', isAuth, adminController.getProducts);

router.get('/add-product', isAuth, adminController.getAddProducts);

// // Post methods =>
router.post(
  '/add-product',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProducts,
);

router.get('/edit-product/:idProduct', isAuth, adminController.getEditProducts);

router.post(
  '/edit-product',
  [
    body('title').isString().isLength({ min: 3 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct,
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);
module.exports = router;
