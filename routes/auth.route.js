const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const User = require('../models/user.model');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.post(
  '/login',
  [
    body('email', 'Please enter a valid email.')
      .isEmail()
      .custom((value, { _req }) => {
        return User.findOne({ email: value }).then(user => {
          if (!user) {
            return Promise.reject('Invalid email or password');
          }
        });
      }),
    body(
      'password',
      'Please enter a password with numbers and at least 5 characters.',
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin,
);

router.post('/logout', authController.postLogout);

router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { _req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'Email exist already please pick a different one',
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with numbers and at least 5 characters.',
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords has to match');
      }
      return true;
    }),
  ],
  authController.postSignup,
);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
