var User = require('../models/user');

exports.get = function(req, res) {
    // use our user model to find the user we want
    User.findById(req.decoded, function(err, user) {

        if (err) {
            return res.status(500).send(err);
        }

        // return 200
        return res.status(200).send({
            "id": user._id,
            "phone": user.phone,
            "name": user.name,
            "email": user.email
        });
    });
};

exports.put = function(req, res) {
    // use our user model to find the user we want
    User.findById(req.decoded, function(err, user) {

        if (err) {
            return res.status(500).send(err);
        }

        user.phone = req.body.phone; // update the users info
        user.name = req.body.name;
        user.email = req.body.email;
        if ((req.body.current_password) && (req.body.new_password)) {
            if (user.checkPassword(req.body.current_password)) {
                user.password = req.body.new_password;
            } else {
                // return an error
                return res.status(422).send({
                    "field": "current_password",
                    "message": "Wrong current password"
                });
            }
        }

        // save the user
        user.save(function(err) {
            if (err) {
                return res.status(500).send(err);
            }

            // return 200
            return res.status(200).send({
                "id": user._id,
                "phone": user.phone,
                "name": user.name,
                "email": user.email
            });
        });
    });
};
