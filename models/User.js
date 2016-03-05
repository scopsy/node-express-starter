var mongoose    = require('mongoose')
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');


var UserSchema = new Schema({
    name: String,
    email: String,
    picture: String,
    gender: String,
    password: {
        type: String,
        select: false
    },

    // Generated on password reset request
    passwordTokenReset: String,
    passwordResetValidUntil: Date,
    address: {
        city: String,
        street: String,
        houseNum: String,
        aptNum: String,
        postalCode: Number,
        country: String
    },
    contacts: {
        linePhone: [String],
        cellPhone: [String],
        fax: String,
        contact: [{
            name: String,
            position: String,
            cellphone: [String],
            phone: [String],
            email: String
        }]
    },
    facebook: String,
    twitter: String,
    google: String,
    tokens: [{
        provider: String,
        token: String
    }],

    visits: {
        type: Number,
        default: 0
    },
    lastLoginDate: Date,
    created: {
        type: Date,
        default: Date.now
    }
});


UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password, cb) {

    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);

        cb(isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);