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

  console.log(req.body);

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

router.get('/active-roles', (req, res) => {
  const userId = req.session.userid;
  const sql = `
    SELECT r.*
    FROM roles r
    INNER JOIN user_roles ru ON r.id = ru.role_id
    WHERE ru.user_id = ? AND ru.enddate IS NULL
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      if (rows.length === 0) {
        res.status(200).send([{id:0, name: 'No Active Roles'}]);
      } else {
        res.json(rows);
      }
    }
  });
});

module.exports = router;