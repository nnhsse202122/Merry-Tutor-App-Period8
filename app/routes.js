module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // route for login form
    // route for processing the login form
    // route for signup form
    // route for processing the signup form


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

/////////////////////////////////////////////////////////////// 1
/////////////////////////////////////////////////////////////// 2
/////////////////////////////////////////////////////////////// 3
/////////////////////////////////////////////////////////////// 4
/////////////////////////////////////////////////////////////// 5

    // facebook routes
    // twitter routes

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));    // =============================================================================
            // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
            // =============================================================================
        
                // locally --------------------------------
                    app.get('/connect/local', function(req, res) {
                        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
                    });
                    app.post('/connect/local', passport.authenticate('local-signup', {
                        successRedirect : '/profile', // redirect to the secure profile section
                        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
                        failureFlash : true // allow flash messages
                    }));
                // google ---------------------------------
        
                    // send to google to do the authentication
                    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
        
                    // the callback after google has authorized the user
                    app.get('/connect/google/callback',
                        passport.authorize('google', {
                            successRedirect : '/profile',
                            failureRedirect : '/'
                        }));



                        // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

        // local -----------------------------------
        app.get('/unlink/local', function(req, res) {
            var user            = req.user;
            user.local.email    = undefined;
            user.local.password = undefined;
            user.save(function(err) {
                res.redirect('/profile');
            });
        });
        // google ---------------------------------
        app.get('/unlink/google', function(req, res) {
            var user          = req.user;
            user.google.token = undefined;
            user.save(function(err) {
               res.redirect('/profile');
            });
        });
            };

            // route middleware to ensure user is logged in
            function isLoggedIn(req, res, next) {
                if (req.isAuthenticated())
                    return next();
        
                res.redirect('/');
            }