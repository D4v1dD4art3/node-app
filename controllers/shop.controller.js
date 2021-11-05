const Product = require('../models/product.model');

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts();
    })
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
  let fetchCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
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
