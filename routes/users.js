const express = require('express');
const router = express.Router();

//Shared dn connection
const db = require('../shared.js');

router.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('users', {title:"Users", users: rows,  session: req.session});
  });
});

module.exports = router;