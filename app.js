const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin.route');
const shopRoutes = require('./routes/shop.route');
const authRoute = require('./routes/auth.route');
const errorController = require('./controllers/error.controller');

const MONGODB_URI =
  'mongodb+srv://v25798979D:SjNV2JvCEynwUCAQ@cluster0.e7urz.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();

const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (req.session.isLoggedIn) {
    req.session.user = new User().init(req.session.user);
  }
  next();
});

// another alternative
// app.use((req, res, next) => {
//   if (!req.session.user) {
//     next();
//   }
//   User.findById(req.session.user._id)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.use((req, res, next) => {
  res.locals.url = req.originalUrl;
  next();
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoute);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// SjNV2JvCEynwUCAQ mondoDb password
