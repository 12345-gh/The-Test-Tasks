var User    = require('../models/user'),
    Item    = require('../models/item'),
    fs      = require("fs");

exports.post = function(req, res, next) {
    var item = new Item();      // create a new instance of the Item model

    // use our user model to find the user we want
    User.findById(req.decoded, function(err, user) {

        if (err) {
            return res.status(500).send(err);
        }

        if (user) {
            if (req.body) {
                item.title = req.body.title;  // set the item param (comes from the request)
                item.price = req.body.price;
                item.user_id = user._id;

                // save the item and check for errors
                item.save(function (err) {
                    if (err) {
                        // return an error
                        return res.status(422).send({
                            "field": "title",
                            "message": "Title is required"
                        });
                    }

                    // return 200
                    return res.status(200).send({
                        "id": item._id,
                        "created_at": item.created_at,
                        "title": item.title,
                        "price": item.price,
                        "image": item.image,
                        "user_id": item.user_id,
                        "user": {
                            "id": user._id,
                            "phone": user.phone,
                            "name": user.name,
                            "email": user.email
                        }
                    });
                });
            } else {
                return res.status(403).send({});
            }
        } else {
            return res.status(403).send({});
        }
    });
};

exports.delete = function(req, res) {
    Item.remove({_id: req.params.item_id}, function(err, item) {
        if (err) {
            return res.status(403).send({});
        }

        if (!item){
            return res.status(404).send({});
        }

        return res.status(200).send({});
    });
};

exports.put = function(req, res) {
    // use our user model to find the user we want
    User.findById(req.decoded, function(err, user) {

        if (err) {
            return res.status(500).send(err);
        }

        if (user) {
            // use our item model to find the item we want
            Item.findById( req.params.item_id, function(err, item) {

                if (err) {
                    return res.status(500).send(err);
                }

                if (item) {
                    if (req.body.title) {
                        item.title = req.body.title;
                    }
                    if (req.body.price) {
                        item.price = req.body.price;
                    }

                    // save the item and check for errors
                    item.save(function (err) {
                        if (err) {
                            // return an error
                            return res.status(422).send({
                                "field": "title",
                                "message": "Title is required"
                            });
                        }

                        // return 200
                        return res.status(200).send({
                            "id": item._id,
                            "created_at": item.created_at,
                            "title": item.title,
                            "price": item.price,
                            "image": item.image,
                            "user_id": item.user_id,
                            "user": {
                                "id": user._id,
                                "phone": user.phone,
                                "name": user.name,
                                "email": user.email
                            }
                        });
                    });
                } else {
                    return res.status(404).send({});
                }
            });
        } else {
            return res.status(403).send({});
        }
    });
};

exports.get = function(req, res) {
    // use our item model to find the item we want
    Item.findById( req.params.item_id, function(err, item) {

        if (err) {
            return res.status(500).send(err);
        }

        if (item) {
            // use our user model to find the user we want
            User.findById(item.user_id, function(err, user) {
                if (err) {
                    return res.status(500).send(err);
                }

                if (user) {
                    // return 200
                    return res.status(200).send({
                        "id": item._id,
                        "created_at": item.created_at,
                        "title": item.title,
                        "price": item.price,
                        "image": item.image,
                        "user_id": item.user_id,
                        "user": {
                            "id": user._id,
                            "phone": user.phone,
                            "name": user.name,
                            "email": user.email
                        }
                    });
                } else {
                    return res.status(404).send({});
                }
            });
        } else {
            return res.status(404).send({});
        }
    });
};

exports.postimage = function(req, res) {
    // use our user model to find the user we want
    User.findById(req.decoded, function(err, user) {

        if (err) {
            return res.status(500).send(err);
        }

        if (user) {
            // use our item model to find the item we want
            Item.findById( req.params.item_id, function(err, item) {

                if (err) {
                    return res.status(500).send(err);
                }

                if (item) {
                    if (req.file) {

                        item.image = req.file.destination+req.file.filename;

                        // save the item and check for errors
                        item.save(function (err) {
                            if (err) {
                                // return an error
                                return res.status(422).send({
                                    "field": "title",
                                    "message": "Title is required"
                                });
                            }

                            // return 200
                            return res.status(200).send({
                                "id": item._id,
                                "created_at": item.created_at,
                                "title": item.title,
                                "price": item.price,
                                "image": req.get('host')+'/'+item.image,
                                "user_id": item.user_id,
                                "user": {
                                    "id": user._id,
                                    "phone": user.phone,
                                    "name": user.name,
                                    "email": user.email
                                }
                            });
                        });
                    } else {
                        return res.status(403).send({});
                    }
                } else {
                    return res.status(404).send({});
                }
            });
        } else {
            return res.status(403).send({});
        }
    });
};

exports.deleteimage = function(req, res) {
    // use our user model to find the user we want
    User.findById(req.decoded, function(err, user) {

        if (err) {
            return res.status(500).send(err);
        }

        if (user) {
            // use our item model to find the item we want
            Item.findById( req.params.item_id, function(err, item) {

                if (err) {
                    return res.status(500).send(err);
                }

                if (item.image) {
                    fs.unlink(item.image, function(err) {
                        if (err) {
                            return res.status(500).send(err);
                        }

                        item.image = undefined;

                        // save the item and check for errors
                        item.save(function (err) {
                            if (err) {
                                // return an error
                                return res.status(422).send({
                                    "field": "title",
                                    "message": "Title is required"
                                });
                            }
                            // return 200
                            return res.status(200).send({});
                        });
                    });
                } else {
                    return res.status(404).send({});
                }
            });
        } else {
            return res.status(403).send({});
        }
    });
};