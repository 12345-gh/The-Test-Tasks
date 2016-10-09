var User    = require('../models/user'),
    jwt     = require('jsonwebtoken'),  // used to create, sign, and verify tokens
    config  = require('../../config');      // get our config file

exports.post = function(req, res, next) {
    var user = new User();      // create a new instance of the User model

    user.phone = req.body.phone;  // set the users param (comes from the request)
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    // save the user and check for errors
    user.save(function(err) {
        if (err) {
            // return an error
            return res.status(422).send({
                "field": err.name,
                "message": err.message
            });
        }

        // create a token
        var token = jwt.sign(user._id, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        res.json({ token: token });
    });

};
