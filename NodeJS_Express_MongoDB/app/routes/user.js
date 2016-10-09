var User = require('../models/user');

exports.getbyid = function(req, res) {
    // use our user model to find the user we want
    User.findById(req.params.user_id, function(err, user) {

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

exports.getbyparam = function(req, res) {
    if ((req.query.name) || (req.query.email)) {

        //use our user model to find the user we want
        User.findOne(req.query, function(err, user) {

            if (err) {
                return res.status(500).send(err);
            }

            if (user) {
                // return 200
                return res.status(200).send({
                    "id": user._id,
                    "phone": user.phone,
                    "name": user.name,
                    "email": user.email
                });
            } else {
                return res.status(404).send({});
            }
        });
    }
};