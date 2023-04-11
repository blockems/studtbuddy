const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//Shared dn connection
const db = require('../shared.js');

// Signup form
router.get('/', (req, res) => {
  res.render('signup', { title: 'Sign up', error: null });
});

// Signup action
router.post('/', (req, res) => {
  const { email, password, confirmPassword, firstname, lastname } = req.body;

  if (email && password && confirmPassword && firstname && lastname) {
    if (password === confirmPassword) {
      // Hash password before storing in database
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error(err.message);
          res.status(500).send('Internal server error');
        } else {
            db.run('INSERT INTO users (email, password, firstname, lastname, companyid) VALUES (?, ?, ?, ?, 0)', [email, hash, firstname, lastname], (err) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Internal server error');
                } else {
                    res.redirect('/');
                }
            });
        }
      });
    } else {
      res.render('signup', { title: 'Sign up', error: 'Passwords do not match' });
    }
  } else {
    res.render('signup', { title: 'Sign up', error: 'Please enter your name, email address, and a matching password.' });
  }
});

module.exports = router;
