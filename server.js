// server.js

const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.db');

// Require the routes for each data source
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

// Use the routes for each data source
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
