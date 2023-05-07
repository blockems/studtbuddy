const express = require('express');
const router = express.Router();

//Shared dd connection
const db = require('../shared.js');

router.get('/', (req, res) => {
  db.all('SELECT * FROM roles', [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('roles', {title:"Roles", roles: rows, session: req.session});
  });
});

router.post('/search', (req, res) => {
  const searchQuery = req.body.searchQuery;
  const sql = `
    SELECT *
    FROM roles
    WHERE name LIKE '%' || ? || '%'
  `;

  db.all(sql, [searchQuery], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(rows);
    }
  });
});

router.post('/newrole', (req, res) => {
  const { roleId } = req.body;
  const userId = req.session.userid; // access the session.userid value
  const sql = `
    INSERT INTO user_roles (user_id, role_id, startdate, enddate, notes)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [userId, roleId, new Date(), null, ''];
  db.run(sql, values, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.status(200).send('Success');
    }
  });
});


router.get('/in-demand-roles', (req, res) => {
  const inDemandRoles = [
    {
      id: 1,
      name: 'Front-End Developer',
      description: 'Expert in HTML, CSS, and JavaScript',
      hourlyRate: '$50 - $80',
      demand: 'High'
    },
    {
      id: 2,
      name: 'Data Scientist',
      description: 'Expert in statistical analysis and machine learning',
      hourlyRate: '$60 - $100',
      demand: 'High'
    },
    {
      id: 3,
      name: 'Cloud Solutions Architect',
      description: 'Expert in designing and implementing cloud solutions',
      hourlyRate: '$80 - $120',
      demand: 'High'
    },
    {
      id: 4,
      name: 'Product Manager',
      description: 'Expert in product strategy and development',
      hourlyRate: '$60 - $100',
      demand: 'Medium'
    },
    {
      id: 5,
      name: 'UI/UX Designer',
      description: 'Expert in user interface and user experience design',
      hourlyRate: '$50 - $80',
      demand: 'Medium'
    }
  ];

  res.json(inDemandRoles);
});

router.get('/history', (req, res) => {
  const myhistory = [
    {
      id: 1,
      activity: 'log in!',
      date: 'today!',
    }
  ];

  res.json(myhistory);
});

router.get('/skills-required/:id', (req, res) => {
  const roleId = req.params.id;
  const userId = req.session.userid;
  const query = `SELECT rs.role_id, s.id as skill_id, s.name as skillname, rs.seniority, rs.importance, s.description as skilldescription, r.id, r.date as resultdate, r.score,
                  case when rs.seniority = 'Competent' then 1 when rs.seniority = 'Expert' then 2 when rs.seniority = 'Lead' then 3 else 0 end as seniorityorder,
                  r.id as result_id, r.date, r.user_id, r.no_questions, r.no_correct, r.score
                  FROM roles_skills rs
                  JOIN skills s ON s.id = rs.skill_id
                  LEFT OUTER JOIN results r ON r.skill_id = s.id AND r.user_id = ?
                  WHERE rs.importance = 'Required' AND rs.role_id = ?
                  ORDER BY rs.importance DESC, seniorityorder, skillname;`;
  
  db.all(query, [userId, roleId], (error, result) => {
    if (error) {
      res.status(500).send({ error: 'Error retrieving skill information' });
    } else {
      res.json(result);
    }
  });
});

router.get('/skills-recommended/:id', (req, res) => {
  const roleId = req.params.id;
  const userId = req.session.userid;
  const query = `SELECT rs.role_id, s.id as skill_id, s.name as skillname, rs.seniority, rs.importance, s.description as skilldescription, r.id, r.date as resultdate, r.score,
                  case when rs.seniority = 'Competent' then 1 when rs.seniority = 'Expert' then 2 when rs.seniority = 'Lead' then 3 else 0 end as seniorityorder,
                  r.id as result_id, r.date, r.user_id, r.no_questions, r.no_correct, r.score
                  FROM roles_skills rs
                  JOIN skills s ON s.id = rs.skill_id
                  LEFT OUTER JOIN results r ON r.skill_id = s.id AND r.user_id = ?
                  WHERE rs.importance = 'Recommended' AND rs.role_id = ?
                  ORDER BY rs.importance DESC, seniorityorder, skillname;`;
  
  db.all(query, [userId, roleId], (error, result) => {
    if (error) {
      res.status(500).send({ error: 'Error retrieving skill information' });
    } else {
      res.json(result);
    }
  });
});

router.get('/active-roles', (req, res) => {
  const userId = req.session.userid;
  const parentQuery = `SELECT r.id, r.name, r.description, ru.startdate, ru.enddate, ru.id AS userRoleId
                       FROM roles r
                       INNER JOIN user_roles ru ON r.id = ru.role_id
                       WHERE ru.user_id = ? AND ru.enddate IS NULL
                       ORDER BY ru.startdate DESC`;

  db.all(parentQuery, userId, (parentError, parentResults) => {
    if (parentError) {
      res.status(500).send({ error: 'Error retrieving parent data' });
    } else {
      res.json(parentResults);
    }
  });
});


module.exports = router;