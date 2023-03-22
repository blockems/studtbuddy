// users.js

const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();


router.get('/', (req, res) => {
  const db = new sqlite3.Database('./data/database.db');
  db.all('SELECT s.*, u.id as user_id, u.first_name, u.last_name FROM stories s LEFT JOIN users u ON s.assigned_id = u.id ORDER BY order_no', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('stories', { stories: rows });
  });
  db.close();
});

// Handle PUT request to /stories/:story_id/:fieldname
router.put('/:story_id/:fieldname', (req, res) => {
  const db = new sqlite3.Database('./data/database.db');
  const { story_id, fieldname } = req.params;
  const { [fieldname]: newFieldValue } = req.body;

  // Update the story field with the new value
  const sql = `UPDATE stories SET ${fieldname} = ? WHERE id = ?`;
  const params = [newFieldValue, story_id];
  db.run(sql, params, function(err) {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.send('Story updated successfully');
    }
  });
  db.close();
});

router.post('/', async (req, res) => {
  const { order_no, summary, last_name, estimate, description, acceptance_criteria } = req.body;
  const db = new sqlite3.Database('./data/database.db');
  try {
    const result = await db.run(`
      INSERT INTO stories (order_no, summary, estimate, description, acceptance_criteria, story_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `, order_no, summary, estimate, description, acceptance_criteria, 'Story');

    const newStory = await db.get('SELECT * FROM stories WHERE id = ?', result.lastID);

    res.status(200).json(newStory);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  db.close();
});

module.exports = router;
