const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/config'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory to be served
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars engine initialization
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Session handling
app.use(session({
  secret: 'super secret secret',
  cookie: { maxAge: 3600000 }, // 1 hour session cookie
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
}));

// Requiring our models for syncing
const { User, Post, Comment } = require('./models');

// Routes
const homeRoutes = require('./controllers/homeRoutes');
// You'd add more routes for things like user authentication, dashboard, etc.

app.use(homeRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/api/users', userRoutes);
// and so on...

// Syncing our sequelize models and then starting our Express app
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
});
