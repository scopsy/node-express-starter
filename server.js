/**
 *  Node and Express starter project.
 *
 */

var express         = require('express');
var handlebars      = require('express-handlebars');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var mongoose        = require('mongoose');
var dotenv          = require('dotenv');
var favicon         = require('serve-favicon');
var lusca           = require('lusca');
var path            = require('path');
var compress        = require('compression');
var logger          = require('morgan');
var validator       = require('express-validator');
var session         = require('express-session');
var MongoStore      = require('connect-mongo/es5')(session);
var passport        = require('passport');
var flash           = require('express-flash');
var errorhandler    = require('errorhandler');

var hbsHelpers      = require('./helpers/hbs.helpers');

/**
 * Loads the .env file which contains all the required config data.
 */
dotenv.config();

/**
 * PassportJS configurations, responsible for authentication.
 */
require('./config/passport')(passport);

/**
 * Launch the server application
 */
var app = express();
var hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: hbsHelpers
});

/**
 * Connect to MongoDB
 */
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

app.set('port', process.env.PORT || 1339);
app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.disable('x-powered-by');

app.use(compress());
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
app.use(cookieParser());
app.use(flash());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB,
        ttl: 4500,
        autoReconnect: true
    })
}));

app.use(passport.initialize());
app.use(passport.session());

/**
 * Security library enabled
 */
app.use(lusca({
    xframe: 'SAMEORIGIN',
    xssProtection: true
}));

app.use(function(req, res, next) {
    res.locals.user = req.user;

    next();
});

app.use(function(req, res, next) {
    if (/api/i.test(req.path)) {
        req.session.returnTo = req.path;
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 560000 }));

require('./controllers/api.ctrl')(app, express, isAuthenticated);
require('./controllers/auth.ctrl')(app, express, isAuthenticated);
require('./controllers/public.ctrl')(app, express, isAuthenticated);


if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler())
}

app.listen(app.get('port'), function() {
    console.log('App listening on port %d in %s mode', app.get('port'), app.get('env'));
});

function isAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    if(!req.xhr){
        res.redirect('/login');
    } else {
        res.status(401);
    }
}

module.exports = app;