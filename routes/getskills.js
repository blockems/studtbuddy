const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.db');

router.get('/:id1/:id2', (req, res) => {
  const id1 = req.params.id1;
  const id2 = req.params.id2;

  // First database call to retrieve role/skill information
  db.all('SELECT r.name, rs.seniority, rs.importance, s.name as skillname, s.description as skilldescription \
        FROM roles r, roles_skills rs, skills s \
        WHERE r.id = rs.role_id and s.id = rs.skill_id and skill_id = ? and r.id = ? \
        order by r.name asc, rs.importance desc', [id1, id2], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    const skills = rows;

    // Second database call to retrieve questions for the specified role_id and skill_id
    db.all('SELECT * FROM Questions WHERE skill_id = ? AND role_id  = ?', [id1, id2], (err, rows) => {
      if (err) {
        return console.error(err.message);
      }
      const questions = rows;

      res.render('getskills', { skills: skills, questions: questions });
    });
  });
});

module.exports = router;
