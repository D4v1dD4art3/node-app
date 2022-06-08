const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '7e1899832e6caa',
    pass: '70eacfefaba29c',
  },
});

exports.getLogin = (req, res, _next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: '',
      password: '',
    },
  });
};

exports.getSignup = (req, res, _next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'signup',
    isAuthenticated: false,
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
};

exports.postLogin = (req, res, _next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  let fetchUser;
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      docTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: {
        email,
        password,
      },
    });
  }
  User.findOne({ email: email })
    .then(user => {
      fetchUser = user;
      return bcryptjs.compare(password, user.password);
    })
    .then(doMatch => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = fetchUser;
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      }
      res.redirect('/auth/login');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSignup = (req, res, _next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      docTitle: 'signup',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: {
        email,
        password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  }
  bcryptjs
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(_result => {
      res.redirect('/auth/login');
      return transport.sendMail({
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Signup succeeded',
        html: '<h1>You successfully signed up</h1>',
      });
    })
    .then(() => {
      console.log('email sent');
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, _next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
exports.getReset = (req, res, _next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    docTitle: 'reset',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postReset = (req, res, _next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/auth/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('error', 'no account with that email was found');
          return res.redirect('/auth/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        transport.sendMail({
          to: email,
          from: 'shop@node-complete.com',
          subject: 'Reset password',
          html: `
          <p>
            You requested a password
          </p>
          <p>
            Click this <a href="http://localhost:3000/auth/reset/${token}">link</a> to set a new password
          </p>
          `,
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
exports.getNewPassword = (req, res, _next) => {
  const token = req.params.token;
  let message = req.flash('error');
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        docTitle: 'new-password',
        isAuthenticated: false,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(_err => {});
};

exports.postNewPassword = (req, res, _next) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then(user => {
      resetUser = user;
      return bcryptjs.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(_result => {
      console.log('password reset!');
      res.redirect('/auth/login');
    })
    .catch(_err => {});
};
