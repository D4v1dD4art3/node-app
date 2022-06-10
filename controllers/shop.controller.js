const Product = require('../models/product.model');
const Order = require('../models/order.model');

const mongoose = require('mongoose');

const serverErrorHandler = err => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
};

exports.getCart = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart',
        products: products,
      });
    })
    .catch(serverErrorHandler);
};

exports.postCarts = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.session.user.addToCart(product);
    })
    .then(result => {
      console.log('Product Added');
      console.log(result);
      res.redirect('/cart');
    })
    .catch(serverErrorHandler);
};

exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .removeFromCart(prodId)
    .then(() => {
      console.log('Items was deleted!');
      res.redirect('/cart');
    })
    .catch(serverErrorHandler);
};

exports.getOrders = (req, res, next) => {
  res.render('shop/order', {
    path: '/orders',
    docTitle: 'Your Orders',
  });
};

exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    docTitle: 'All Products',
    path: '/',
  });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/products-list', {
        prods: products,
        docTitle: 'Shop',
        path: '/products',
      });
    })
    .catch(serverErrorHandler);
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.idProduct;
  if (!mongoose.Types.ObjectId.isValid(prodId)) {
    return res.redirect('/');
  }
  Product.findById(prodId)
    .then(product => {
      return res.render('shop/product-detail', {
        product: product,
        docTitle: product.title,
        path: '/',
      });
    })
    .catch(serverErrorHandler);
};

exports.postOrder = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.session.user.email,
          userId: req.session.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      return req.session.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(serverErrorHandler);
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
      res.render('shop/order', {
        path: '/orders',
        docTitle: 'Your Orders',
        orders,
      });
    })
    .catch(serverErrorHandler);
};
