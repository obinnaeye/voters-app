'use strict';

var path = process.cwd();

var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');



module.exports = function (app, passport) {
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
    
    var clickHandler = new ClickHandler();
    
    //no auth
    app.route('/')
        .get( function (req, res) {
            res.sendFile(path + '/public/index.html');
    });
    
    
    app.route('/login')
    .get(function (req, res) {
        res.sendFile(path + '/public/login.html');
    });
    
    //when logged out, back to home
    app.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
    app.route('/profile')
    .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/profile.html');
    });
    
    app.route('/api/:id')
    .get(isLoggedIn, function (req, res) {
        res.json(req.user.github);
    });
    
    // authenticate user on github
    app.route('/auth/github')
    .get(passport.authenticate('github'));
    
    //after authentcation, what next
    app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    
    //create created polls for authenticated individuals
    //add new polls
    //delete polls by user
    app.route('/api/:id/polls')
    .get(isLoggedIn, clickHandler.getClicks)
    .post(isLoggedIn, clickHandler.addClick)
    .delete(isLoggedIn, clickHandler.resetClicks);
    
    app.route('/api/:id/votes')
    .get(isLoggedIn, clickHandler.getClicks)
    .post(isLoggedIn, clickHandler.addClick)
    .delete(isLoggedIn, clickHandler.resetClicks);
};