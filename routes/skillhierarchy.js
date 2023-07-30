// products.js

const express = require('express');
const router = express.Router();

//Shared dn connection
const db = require('../shared.js');

router.get('/', (req, res) => {
  db.all(`
  SELECT r.name, r.description, rs.seniority, rs.importance, s.name as skillname, s.description as skilldescription, s.id as skill_id, r.id as role_id,
  case when rs.seniority = 'Competent' then 1 when rs.seniority = 'Expert' then 2 when rs.seniority = 'Lead' then 3 else 0 end as seniorityorder
  FROM roles r, roles_skills rs, skills s
  WHERE r.id = rs.role_id and s.id = rs.skill_id
  order by r.name asc, seniorityorder, rs.importance desc`, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('skillhierarchy', { title:"Skills Heirarchy", skills: rows, session: req.session});
  });
});

router.get('/test-skills/:id/:importance', (req, res) => {
  res.render('test-skills', {title:"Test Skills", session: req.session})
});

router.post('/submit-results', (req, res) => {
  const correctAnswers = req.body.correctAnswers;
  const explanations = req.body.explanations;

  res.render('results', {
    title: "Skills Heirarchy",
    session: req.session,
    correctAnswers: correctAnswers,
    explanations: explanations
  });
});

router.get('/questions/:id/:importance', (req, res) => {
  const roleId = req.params.id;
  const importance = req.params.importance;

  const query = `SELECT * 
  FROM Questions q, 
  skills s,
    roles_skills rs
  where q.skill_id = s.id 
  and s.id = rs.skill_id
  and q.role_id = ?
  and rs.importance = ?`

  console.log (query + " roleid:" + roleId + "improtance: " + importance);
  
  db.all(query, [roleId,importance], 
    (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(rows);
      }
    }
  );
});

module.exports = router;