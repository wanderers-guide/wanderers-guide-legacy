const router = require('express').Router();
const passport = require('passport');

const User = require('../models/contentDB/User');

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

    if(req.user.patreonAccessToken != null){
        const apiClient = patreonAPI(req.user.patreonAccessToken);
        apiClient('/current_user')
        .then((result) => {

            console.log('Patreon - Valid Access Token - OK');
            res.redirect('/profile/characters');

        }).catch((err) => {

            console.log('Patreon - Invalid Access Token - ISSUE');
            let updateValues = {
                isPatreonSupporter: 0,
                isPatreonMember: 0,
                patreonAccessToken: null
            };
            User.update(updateValues, { where: { id: req.user.id } })
            .then((result) => {
                res.redirect('/profile');
            });
            
        });
    } else {

        console.log('Patreon - No Access Token - OK');
        res.redirect('/profile/characters');

    }

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
let redirectURL;
if (process.env.PRODUCTION == 'true'){
    redirectURL = 'https://wanderersguide.app/auth/patreon/redirect';
} else {
    redirectURL = 'http://localhost/auth/patreon/redirect';
}

router.get('/patreon/redirect', (req, res) => {
    if(!req.user){
        res.redirect('/');
        return;
    }

    const { code } = req.query;
    let token;
    
    return patreonOAuthClient.getTokens(code, redirectURL)
    .then(({ access_token }) => {
        token = access_token;
        const apiClient = patreonAPI(token);
        return apiClient('/current_user');
    }).then(({ store }) => {

        let userData = store.findAll('user').map(user => user.serialize());

        let patreonUserID = userData[userData.length-1].data.id;
        let patreonName = userData[userData.length-1].data.attributes.full_name;
        let patreonEmail = userData[userData.length-1].data.attributes.email;

        let pledgesData = userData[userData.length-1].data.relationships.pledges.data;
        let isSupporter = (pledgesData.length > 0);
        //console.log(pledgesData); // Pledge data has the tier IDs

        let updateValues;
        if(isSupporter){
            let pData = pledgesData[pledgesData.length-1];
            let isMember = (pData.type === 'pledge' && pData.id === '46234666');
            let isMemberBinary = (isMember) ? 1 : 0;
            updateValues = {
                isPatreonSupporter: 1,
                isPatreonMember: isMemberBinary,
                patreonUserID: patreonUserID,
                patreonFullName: patreonName,
                patreonEmail: patreonEmail,
                patreonAccessToken: token
            };
        } else {
            updateValues = {
                isPatreonSupporter: 0,
                isPatreonMember: 0,
                patreonUserID: patreonUserID,
                patreonFullName: patreonName,
                patreonEmail: patreonEmail,
                patreonAccessToken: token
            };
        }
        User.update(updateValues, { where: { id: req.user.id } })
        .then((result) => {
            res.redirect('/profile');
            return;
        }).catch((err) => {
            res.status(500);
            res.render('error/patreon_link_error', { title: "Account Linking Error - Wanderer's Guide", user: req.user });
            return;
        });

    }).catch((err) => {
        res.redirect('/');
        return;
    });

    /*
    return patreonOAuthClient.getTokens(code, redirectURL)
    .then(({ access_token }) => {
        token = access_token;
        const apiClient = patreonAPI(token);
        return apiClient('/campaigns/'+campaignID+'/pledges');
    }).then(({ store }) => {
        //console.log(store);
        //console.log(store.findAll('user').map(user => user.serialize()));
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });*/

    /* Patreon API Docs:
        https://docs.patreon.com/#step-3-handling-oauth-redirect
        https://github.com/Patreon/patreon-js
    */

});


module.exports = router;