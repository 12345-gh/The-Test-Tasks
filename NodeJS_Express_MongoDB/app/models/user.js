// get an instance of mongoose and mongoose.Schema
var mongoose     = require('mongoose'),
    crypto       = require('crypto'),
    Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    phone: {
        type: String,
        required: false
    },
    name: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    _plainPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

UserSchema.virtual('userId')
    .get(function () {
        return this.id;
    });

UserSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


UserSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);