const User = require('../models/user.model');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'signup',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('618b3b7f41436507cc087bd0')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect('/auth/login');
      }
      const user = new User({
        email,
        password,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      console.log('User created');
      res.redirect('/auth/login');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
