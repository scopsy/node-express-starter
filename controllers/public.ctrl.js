/**************************************************
 *
 *          Public Routes file
 *
**************************************************/

module.exports = function (app, express, isLoggedIn) {
    var pubRouter   = express.Router();
    var helpers     = require('../helpers/general.helper');

    // catch all requests and send to 404 if not found
    pubRouter.get('*', function (req, res) {
        res.render('404',{layout: false});
    });

    app.use('/', pubRouter);
};