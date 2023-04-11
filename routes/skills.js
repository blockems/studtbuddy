// products.js

const express = require('express');
const router = express.Router();

//Shared dn connection
const db = require('../shared.js');

router.get('/', (req, res) => {
  db.all('SELECT * FROM skills', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('skills', {title:"Skills page", skills: rows, session: req.session});
  });
});

module.exports = router;
