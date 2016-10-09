// BASE SETUP
// =============================================================================
// call the packages we need
var express    = require('express'), // call express
    app        = express(), // define our app using express
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    mongoose   = require('mongoose'),
    config     = require('./config'); // get our config file

app.use(morgan('dev')); // use morgan to log requests to the console
mongoose.set('debug', true);

// configure app to use bodyParser()
// this will let us get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000; // used to create, sign, and verify tokens

// BASE SETUP
// =============================================================================
mongoose.connect(config.database); // connect to our database

var db = mongoose.connection;

db.on('error', function (err) {
    console.error('connection error:', err.message);
});

db.once('open', function callback () {
    console.info("Connected to DB!");
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

require('./app/routes/index')(router);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server start on port ' + port);