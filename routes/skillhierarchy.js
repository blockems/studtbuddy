// products.js

const express = require('express');
const router = express.Router();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.db');

router.get('/', (req, res) => {
  db.all("SELECT r.name, r.description, rs.seniority, rs.importance, s.name as skillname, s.description as skilldescription, s.id as skill_id, r.id as role_id, \
  case when rs.seniority = 'Competent' then 1 when rs.seniority = 'Expert' then 2 when rs.seniority = 'Lead' then 3 else 0 end as seniorityorder \
  FROM roles r, roles_skills rs, skills s \
  WHERE r.id = rs.role_id and s.id = rs.skill_id \
  order by r.name asc, seniorityorder, rs.importance desc", [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('skillhierarchy', { skills: rows });
  });
});

module.exports = router;
