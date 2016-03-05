/**************************************************
 *
 *          Auth Routes file
 *
 **************************************************/

module.exports = function (app, express, isLoggedIn) {
    var authRouter  = express.Router();
    var passport    = require('passport');

    authRouter.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user) {
            if(err || !user) return res.redirect('/login');

            req.login(user, function (err) {
                if(err) return res.redirect('/');

                next();
            });
        })(req, res, next);
    }, function (req, res) {
        res.redirect('/dashboard');
    });

    authRouter.route('/logout').get(function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    authRouter.get('/google', passport.authenticate('google', { scope: 'profile email' }));
    authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        res.redirect(req.session.returnTo || '/');
    });
    authRouter.use(isLoggedIn);

    app.use('/auth', authRouter);
};