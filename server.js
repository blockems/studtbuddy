const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

// Require the routes for each data source
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const skillsRoutes = require('./routes/skills');
const indexRoutes = require('./routes/index');
const getskillsRoutes = require('./routes/getskills');
const skillhierarchyRoutes = require('./routes/skillhierarchy');
const storyRoutes = require('./routes/stories');

// Use the routes for each data source
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/getskills', getskillsRoutes);
app.use('/skills', skillsRoutes);
app.use('/skillhierarchy', skillhierarchyRoutes);
app.use('/', indexRoutes);
app.use('/stories', storyRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
