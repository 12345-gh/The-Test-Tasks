var jwt     = require('jsonwebtoken'),  // used to create, sign, and verify tokens
    config  = require('../../config'),  // get our config file
    path    = require('path'),
    multer  = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'images/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname + '-' + Date.now())
        }
    }),
    upload = multer({ storage: storage });

module.exports = function(router) {
    // middleware to use for all requests
    router.use(function(req, res, next) {
        if (   ((req.url === '/register')           && (req.method === 'POST'))
            || ((req.url === '/login')              && (req.method === 'POST'))
            || ((path.dirname(req.url) === '/item') && (req.method === 'GET'))) {
            next(); // make sure we go to the next routes and don't stop here
        } else {

            // check header or url parameters or post parameters for token
            var token = req.body.token || req.query.token || req.headers['authorization'];

            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, config.secret, function (err, decoded) {
                    if (err) {
                        return res.json({success: false, message: 'Failed to authenticate token.'});
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        next();
                    }
                });
            } else {
                // if there is no token
                // return an error
                return res.status(401).send({});
            }
        }
    });

    // test route to make sure everything is working (accessed at GET http://localhost:3000/api)
    router.get('/', function(req, res) {
        res.json({ message: 'Hello! The API is at http://localhost:' + port + '/api' });
    });

    router.post('/login', require('./login').post);
    router.post('/register', require('./register').post);

    router.get('/me', require('./me').get);
    router.put('/me', require('./me').put);

    router.get('/user/:user_id', require('./user').getbyid);
    router.get('/user', require('./user').getbyparam);

    router.get('/item/:item_id', require('./item').get);
    router.put('/item/:item_id', require('./item').put);
    router.post('/item', require('./item').post);
    router.delete('/item/:item_id', require('./item').delete);

    router.post('/item/:item_id/image', upload.single('file'), require('./item').postimage);
    router.delete('/item/:item_id/image', require('./item').deleteimage);
};