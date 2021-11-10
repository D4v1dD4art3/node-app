exports.getLogin = (req, res, next) => {
  //   let isLoggedIn = false;
  //   isLoggedIn = req.get('Cookie').split('=')[1] === 'true';

  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //   req.isLoggedIn = true; resolving a cookie
  res.cookie('loggedIn', 'true', { httpOnly: true });
  res.redirect('/');
};
