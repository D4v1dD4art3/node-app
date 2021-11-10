exports.getLogin = (req, res, next) => {
  //   let isLoggedIn = false;
  //   isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //   req.isLoggedIn = true; resolving a cookie
  req.session.isLoggedIn = true;
  res.redirect('/');
};
