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
            console.error(err);

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
const myUserID = '32932027';

const supporterTierID = '5612688';
const memberTierID = '5628112';

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

        console.log('~~~~~~~~');

        // Campaign Data //
        //let campaignData = store.findAll('campaign').map(campaign => campaign.serialize());
        /* Displays all current tiers and their IDs */
        //console.log(campaignData[0].data.relationships.rewards.data);

        // User Data //
        let userData = store.findAll('user').map(user => user.serialize());
        console.log(userData);

        let uData = findPatronData(userData);
        if(uData == null){
            console.error('Failed to find user data!');
            console.error(userData);
            res.redirect('/');
            return;
        }

        console.log(uData);

        let patreonUserID = uData.id;
        console.log(patreonUserID);
        let patreonName = uData.attributes.full_name;
        console.log(patreonName);
        let patreonEmail = uData.attributes.email;
        console.log(patreonEmail);

        // Pledge Data //
        let pledgeData = store.findAll('pledge').map(pledge => pledge.serialize());
        console.log(pledgeData);
        console.log(pledgeData[0].data.relationships.reward);

        let pledgeTier = findPatronTier(pledgeData);

        let updateValues;
        if(pledgeTier === 'MEMBER'){
            updateValues = {
                isPatreonSupporter: 1,
                isPatreonMember: 1,
                patreonUserID: patreonUserID,
                patreonFullName: patreonName,
                patreonEmail: patreonEmail,
                patreonAccessToken: token
            };
        } else if(pledgeTier === 'SUPPORTER'){
            updateValues = {
                isPatreonSupporter: 1,
                isPatreonMember: 0,
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
        console.error(err);
        res.redirect('/profile');
        return;
    });

});

function findPatronData(userData){
    for(let uData of userData){
        if(uData.data.type == 'user' && uData.data.id != myUserID) {
            return uData.data;
        }
    }
    return null;
}

function findPatronTier(pledgeData){
    for(let pData of pledgeData){
        if(pData.data.type == 'pledge' &&
            pData.data.relationships != null &&
            pData.data.relationships.reward != null){
            if(pData.data.relationships.reward.data.id == supporterTierID){
                return 'SUPPORTER';
            } else if(pData.data.relationships.reward.data.id == memberTierID){
                return 'MEMBER';
            }
        }
    }
    return 'NONE';
}

module.exports = router;