const express = require('express')
const router = express.Router();
const homeData = require('./home')

router.get('/users', (req, res, next) => {
    res.render('users', {users: homeData.users})
})

exports.routes = router