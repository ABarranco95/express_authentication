const express = require('express');
const passport = require('../config/ppConfig');
const db = require('../models');
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) => {
    if (created) {
      // if created, success and redirect to home
      console.log(`${user.name} was created`);
      // Flash message
      const successObject = {
        successRedirect: '/',
        successFlash: 'Account created and logging in...'
      }
      passport.authenticate('local', successObject)(req, res);
      
    } else {
      // Email already exist
      req.flash('error', 'Email already exists...')
      res.redirect('/auth/signup')
    }
  })
  .catch(err => {
    console.log(('Error', err));
    req.flash('error', 'Either email or password is incorrect. Please try again.');
    res.redirect('/auth/signup');
  })
})
module.exports = router;

