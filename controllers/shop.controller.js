const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
exports.getCart = (req, res, next) => {
  Cart.getProducts((cart) => {
    Product.findAll()
      .then((products) => {
        const carProducts = [];
        for (product of products) {
          const cartProductData = cart.products.find(
            (prod) => prod.id === product.id
          );
          if (cartProductData) {
            carProducts.push({
              productData: product,
              qty: cartProductData.qty,
            });
          }
        }
        res.render('shop/cart', {
          path: '/cart',
          docTitle: 'Your Cart',
          products: carProducts,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.postCarts = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then((product) => {
    if (!product) {
      return console.log('not product found');
    }
    Cart.addProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return console.log('not products found');
      }
      Cart.deleteProduct(prodId, product.price);
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/order', {
    path: '/orders',
    docTitle: 'Your Orders',
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        docTitle: 'All Products',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/products-list', {
        prods: products,
        docTitle: 'Shop',
        path: '/products',
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.idProduct;
  Product.findByPk(prodId)
    .then((result) => {
      if (!result) {
        return res.redirect('/');
      }
      return res.render('shop/product-detail', {
        product: result,
        docTitle: result.title,
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    docTitle: 'Checkout Page',
  });
};
