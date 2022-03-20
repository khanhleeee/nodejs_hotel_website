const express = require('express');
var handlebars = require('express-handlebars');
const app = express();
const path = require('path');
const port = 3000;
const bodyParser = require('body-parser');
const route = require('./routes');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const connection = require('./config/database/connection');
connection.connect();

//Middlewares
app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: null } }));

//Flash messages middleware
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})

var hbs = handlebars.create({
    extname: 'hbs'
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app)

app.listen(port, () => {
    console.log(`app listen at http://localhost:${port}`);
})