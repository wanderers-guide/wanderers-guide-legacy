const router = require('express').Router();
const Background = require('../models/backgroundDB/HomeBackground');
const Sequelize = require('sequelize');

const homebrewRoutes = require('./homebrew/homebrew-routes');

const authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/auth/login');
  } else {
    next();
  }
};

// create home route
router.get('/', (req, res) => {
    // Get single random background
    // Test Singles: where: { id: 60 }

    Background.findOne({ order: [ [ Sequelize.fn('RAND') ] ] }).then((background) => {
        res.render('pages/home', { title: "Wanderer's Guide - Pathfinder 2e Character Manager", user: req.user, background });
    }).catch((error) => {
      res.render('pages/website_down', { title: "Website Down - Wanderer's Guide" });
    });
});

// direct homebrew route
router.use('/homebrew', authCheck, homebrewRoutes);

// create license route
router.get('/license', (req, res) => {
    res.render('pages/license', { title: "Licenses - Wanderer's Guide", user: req.user });
});

// create docs routes
router.get('/wsc_docs', (req, res) => {
    res.render('docs/wsc_docs', { title: "WSC Docs - Wanderer's Guide", user: req.user });
});
router.get('/api_docs', (req, res) => {
  res.render('docs/api_docs', { title: "API Docs - Wanderer's Guide", user: req.user });
});

module.exports = router;