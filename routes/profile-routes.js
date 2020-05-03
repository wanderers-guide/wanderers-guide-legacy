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
    res.render('pages/profile', { title: req.user.username+"'s Profile - Apeiron", user: req.user });
});

router.use('/characters', authCheck, charRoutes);

module.exports = router;