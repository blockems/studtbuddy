// products.js

const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM skills', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('skills', { products: rows });
  });
});

module.exports = router;
