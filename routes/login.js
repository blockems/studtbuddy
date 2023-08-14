const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

//Shared dn connection
const db = require('../shared.js');

// Login form
router.get('/', (req, res) => {
  res.render('login', { title: 'Login', session: req.session});
});

// Login action
router.post('/', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else if (!row) {
        res.render('login', { title: 'Login', error: 'Invalid username or password',user: null });
      } else {
        bcrypt.compare(password, row.password, (err, result) => {
          if (result === true) {
            req.session.userid = row.id;
            req.session.user = row.firstname + ' ' + row.lastname;
            req.session.companyid = row.companyid;
            req.session.usertype = row.usertype;
            res.redirect('/');
          } else {
            res.render('login', { title: 'Login', error: 'Invalid username or password', user: null });
          }
        });
      }
    });
  } else {
    res.render('login', { title: 'Login', error: 'Please enter a username and password', user: null });
  }
});

module.exports = router;
