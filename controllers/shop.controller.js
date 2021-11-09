const Product = require('../models/product.model');

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCarts = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log('Product Added');
      console.log(result);
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/order', {
    path: '/orders',
    docTitle: 'Your Orders',
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  Product.findById(prodId)
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

exports.postOrder = (req, res, next) => {
  let fetchCart;
  let fetchProducts;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      fetchProducts = products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      });
      return req.user.createOrder();
    })
    .then((order) => {
      return order.addProduct(fetchProducts);
    })
    .then((result) => {
      return fetchCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      res.render('shop/order', {
        path: '/orders',
        docTitle: 'Your Orders',
        orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
