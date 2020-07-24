const router = require('express').Router();
const charRoutes = require('./char-routes');

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {

    let patreonAuthURL;
    if (process.env.PRODUCTION == 'true'){
        patreonAuthURL = 'https://www.patreon.com/oauth2/authorize?response_type=code&client_id=R9VNPfo04Dd-T2p0nmNNTLhLiRF3EOuat7z2pyx8zD6YVbK1Sm1Kq9kbM509ZVdL&redirect_uri=https://wanderersguide.app/auth/patreon/redirect';
    } else {
        patreonAuthURL = 'https://www.patreon.com/oauth2/authorize?response_type=code&client_id=R9VNPfo04Dd-T2p0nmNNTLhLiRF3EOuat7z2pyx8zD6YVbK1Sm1Kq9kbM509ZVdL&redirect_uri=http://localhost/auth/patreon/redirect';
    }

    let isPatreonConnected = (req.user.patreonAccessToken != null);

    res.render('pages/profile', {
        title: req.user.username+"'s Profile - Wanderer's Guide",
        user: req.user,
        patreonAuthURL: patreonAuthURL,
        isPatreonConnected: isPatreonConnected,
    });
});

router.use('/characters', authCheck, charRoutes);

module.exports = router;