const express = require('express');
const app = express();

// app.use('/', (req, res, next) => {
//   console.log('First Middleware');
//   next();
// });

// app.use('/', (req, res, next) => {
//   console.log('Second Middleware');
//   res.send('<h1>Hello world</h1>');
// });

app.use('/', (req, res, next) => {
  console.log('/ middleware');
  res.send('<h1>the middleware that just handle /</h1>');
});

app.use('/users', (req, res, next) => {
  console.log('/ middleware users');
  res.send('<h1>the middleware that handles users</h1>');
});

app.listen(3000);
