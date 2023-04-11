const sqlite3 = require('sqlite3').verbose();

// Create a database connection object
const db = new sqlite3.Database('./data/database.db');

// Export the database connection object
module.exports = db;
