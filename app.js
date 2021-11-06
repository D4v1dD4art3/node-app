const express = require('express');
const path = require('path');
const mongoDbConnect = require('./utils/database');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

// const adminRoutes = require('./routes/admin.route');
// const shopRoutes = require('./routes/shop.route');
const errorController = require('./controllers/error.controller');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.url = req.originalUrl;
  next();
});

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
app.use(errorController.get404);

mongoDbConnect((clientObject) => {
  console.log(clientObject);
  app.listen(3000);
});

// SjNV2JvCEynwUCAQ mondoDb password
