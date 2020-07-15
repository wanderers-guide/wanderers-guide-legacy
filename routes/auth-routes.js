const router = require('express').Router();
const passport = require('passport');


// ================================================================================ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Account Auth ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ================================================================================ //

// auth login
router.get('/login', (req, res) => {
    res.render('pages/login', { title: "Login - Wanderer's Guide", user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // User info is now stored in req.user

    res.redirect('/profile/characters');
});


// ================================================================================ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Patreon Auth ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ================================================================================ //
const url = require('url');
const patreon = require('patreon');
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;
const campaignID = '4805226';

let patreonOAuthClient = patreonOAuth(process.env.PATREON_CLIENT_ID, process.env.PATREON_CLIENT_SECRET);
let redirectURL = null;
if (process.env.PRODUCTION == 'true'){
    redirectURL = 'https://wanderersguide.app/auth/patreon/redirect';
} else {
    redirectURL = 'http://localhost/auth/patreon/redirect';
}

router.get('/patreon/redirect', (req, res) => {

    const { code } = req.query;
    let token;

    return patreonOAuthClient.getTokens(code, redirectURL)
    .then(({ access_token }) => {
        token = access_token;
        const apiClient = patreonAPI(token);
        return apiClient('/current_user');
    }).then(({ store }) => {
        console.log(store);
        //console.log(store.findAll('user').map(user => user.serialize()));
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });

});

 // /campaigns/+campaignID+/pledges

 // https://docs.patreon.com/#step-4-validating-receipt-of-the-oauth-token
 // https://github.com/Patreon/patreon-js


module.exports = router;