const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const path = require('path');
require('dotenv').config();

// Import the connection to the database (Sequelize instance)
const { sequelize } = require('./models');

// Import routes
const homeRoutes = require('./controllers/homeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({
  helpers: {
    formatDate: (date) => {
      
      return date.toLocaleDateString();
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static content from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up Express session with Sequelize store
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}));

// Routes
app.use('/', homeRoutes);

// Sync sequelize models to the database, then start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
