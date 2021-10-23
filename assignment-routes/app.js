const express = require('express');
const app = express();
const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(usersRouter);
app.use(homeRouter);

app.listen(3000);
