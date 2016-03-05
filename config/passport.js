var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;

var User            = require('../models/User');

module.exports = function (passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        UserExternal.findById(id).populate('entities._portal', 'portalURL agencyName').exec(function(err, user) {
            done(err, user);
        });
    });

    /**
     * Sign in using Email and Password.
     */
    passport.use('local-login', new LocalStrategy({ email: 'email', passReqToCallback : true }, function(req, email, password, done) {
        userid = userid.toLowerCase();

        User.findOne({ email: email }, function(err, user) {
            if (!user) {
                return done(null, false, { message: 'Email ' + email + ' not found'});
            }

            user.comparePassword(password, function(err, isMatch) {
                if (isMatch) {
                    user.lastLoginDate = new Date();
                    user.visits++;

                    user.save();

                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid email or password.' });
                }
            });
        });
    }));


    /**
     * Google Sign in Strategy
     */
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {

        // First checks if its a logged in user.
        // If so we only linking the current account
        if (req.user) {

            User.findOne({ google: profile.id }, function(err, user) {

                // User already linked to this account
                if (user) {
                    req.flash('errors', { msg: 'The user is already connected to their google account. Please unlink connecction first.' });
                    return done(err);
                }

                User.findById(req.user.id, function(err, user) {
                    if(err) return done(err);

                    user.google         = profile.id;
                    user.tokens.push({provider: 'google', token: accessToken});

                    user.name = profile.displayName;

                    if(profile._json){
                        user.gender     = profile._json.gender;
                        user.picture    = profile._json.image.url;
                    }

                    user.save(function(err) {
                        req.flash('info', {msg: 'Google Account successfully linked.'});
                        done(err, user);
                    });
                });
            });
        } else {

            // No user found, creating new user entry
            User.findOne({ google: profile.id }, function(err, googleUser) {
                if (googleUser) {
                    return done(null, user);
                }

                User.findOne({ email: profile.emails[0].value }, function(err, userFound) {
                    if (userFound) {
                        req.flash('errors', { msg: 'Email address is taken.' });
                        return done(err);
                    }

                    var newUser         = new User();
                        newUser.email   = profile.emails[0].value;
                        newUser.google  = profile.id;
                        newUser.tokens.push({ provider: 'google', token: accessToken });

                        newUser.name        = profile.displayName;
                        newUser.gender      = profile._json.gender;
                        newUser.picture     = profile._json.image.url;

                        newUser.save(function(err) {
                            done(err, user);
                        });
                });
            });
        }
    }));
};
