const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user.model');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.route');
const shopRoutes = require('./routes/shop.route');
const errorController = require('./controllers/error.controller');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.url = req.originalUrl;
  next();
});

app.use((req, res, next) => {
  User.findById('618b3b7f41436507cc087bd0')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://v25798979D:SjNV2JvCEynwUCAQ@cluster0.e7urz.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then((result) => {
    return User.findOne();
  })
  .then((user) => {
    if (!user) {
      const user = new User({
        name: 'David',
        email: 'david@duartechsolutions.com',
        cart: {
          items: [],
        },
      });
      user.save();
    }
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// SjNV2JvCEynwUCAQ mondoDb password
