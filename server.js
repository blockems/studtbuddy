const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');


//Load env variables:
require('dotenv').config();
const UI_PORT = process.env.UI_PORT || 3000;;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DEBUG_LEVEL = process.env.DEBUG_LEVEL || '1';

//loging!
if (NODE_ENV === 'development' && DEBUG_LEVEL > '1') {
  app.use(morgan('dev'));
}

//Get data
const db = require('./shared.js');

//Set up ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());

// Require the routes for each data source
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const skillsRoutes = require('./routes/skills');
const indexRoutes = require('./routes/index');
const getskillsRoutes = require('./routes/getskills');
const skillhierarchyRoutes = require('./routes/skillhierarchy');
const storyRoutes = require('./routes/stories');

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Check if user is logged in
const authMiddleware = (req, res, next) => {
  if (req.session?.userid) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

// Use the routes for each data source
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/users', authMiddleware, usersRoutes);
app.use('/roles', authMiddleware, rolesRoutes);
app.use('/getskills', authMiddleware, getskillsRoutes);
app.use('/skills', authMiddleware, skillsRoutes);
app.use('/skillhierarchy', authMiddleware, skillhierarchyRoutes);
app.use('/',authMiddleware, indexRoutes);
app.use('/stories', storyRoutes);

app.listen(UI_PORT, () => {
  console.log(`Server running at http://localhost:${UI_PORT}`);
});

// Handle the "exit" event to close the database connection
process.on('exit', () => {
  db.close();
});