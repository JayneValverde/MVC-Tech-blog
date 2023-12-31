const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = rquire('path');
const helpers = require('./utils/helpers');
const exphbs = require('express-handlebars');
const session =require('express-session');

// Create a new sequilize store using the expression-session package
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const app = express();
const PORT = process.env.PORT || 3001; 

// Incorporate the custom helper methods 
const hbs = exphbs.create({ helpers });

// Set up sessions
const sess = {
    secret: 'Super secret secret',
    cookie: { MaxAge: 36000 },
    resave: false, 
    saveUninitialized: true, 
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() =>{
    app.listen(PORT, () => console.log('Now Listening'));
});