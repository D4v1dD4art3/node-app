const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const db = require('./utils/database');
// const expressHbs = require('express-handlebars');
const app = express();
// app.engine(
//   'hbs',
//   expressHbs({
//     layoutsDir: 'views/layout/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs',
//   })
// );
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin.route');
const shopRoutes = require('./routes/shop.route');
const errorController = require('./controllers/error.controller');
// const rootDir = require('./utils/path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.url = req.originalUrl;
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(3000);
