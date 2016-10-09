var User    = require('../models/user'),
    jwt     = require('jsonwebtoken'),  // used to create, sign, and verify tokens
    config  = require('../../config');      // get our config file

exports.post = function(req, res, next) {
    //var user = new User();      // create a new instance of the User model

    // find the user
    User.findOne({email: req.body.email}, function(err, user) {

        if (err) {
            // return an error
            return res.status(422).send({
                "field": err.name,
                "message": err.message
            });
        }

        if (!user) {
            // return an error
            return res.status(422).send({
                "field": "Authentication failed",
                "message": "User not found"
            });
        } else if (user) {
            // check if password matches
            if (user.checkPassword(req.body.password)) {
                // create a token
                var token = jwt.sign(user._id, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

                res.json({ token: token });
            } else {
                // return an error
                return res.status(422).send({
                    "field": "email",
                    "message": "Wrong email or password"
                });
            }
        }
    });
};
