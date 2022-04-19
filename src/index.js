const express = require('express');
var handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const route = require('./routes');
const path = require('path');
const port = 3333;

const connection = require('./config/database/connection');

connection.connect();

var hbs = handlebars.create({
   extname: 'hbs'
})

hbs.handlebars.registerHelper('ifCond', function (v1, v2, options) {
   if (v1 === v2) {
       return options.fn(this);
   }
   return options.inverse(this);
 });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(express.static(__dirname + '/public'));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded( { extended: true}));
app.use(methodOverride('_method'));

route(app)

app.listen(port, () => {
   console.log(`app listen at http://localhost:${port}`);
})
