module.exports = function (app, express, isLoggedIn) {
    var apiRouter   = express.Router();

    app.use('/api', apiRouter);
};