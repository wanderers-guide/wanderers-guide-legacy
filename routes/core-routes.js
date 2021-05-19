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

// Home Route
router.get('/', (req, res) => {

  let backgroundID = parseInt(req.query.bck_id); if(isNaN(backgroundID)){backgroundID=null;}
  if(backgroundID != null){

    Background.findOne({ where: { id: backgroundID } }).then((background) => {
      res.render('pages/home', { title: "Wanderer's Guide - Pathfinder 2e Character Manager", user: req.user, background });
    }).catch((error) => {
      res.render('pages/website_down', { title: "Website Down - Wanderer's Guide" });
    });

  } else {

    // Get single random background
    Background.findOne({ order: [ [ Sequelize.fn('RAND') ] ] }).then((background) => {
      res.render('pages/home', { title: "Wanderer's Guide - Pathfinder 2e Character Manager", user: req.user, background });
    }).catch((error) => {
      res.render('pages/website_down', { title: "Website Down - Wanderer's Guide" });
    });

  }

});

// Direct Homebrew Route
router.use('/homebrew', authCheck, homebrewRoutes);

// License Route
router.get('/license', (req, res) => {
    res.render('pages/license', { title: "Licenses - Wanderer's Guide", user: req.user });
});

// Docs Routes
router.get('/wsc_docs', (req, res) => {
    res.render('docs/wsc_docs', { title: "WSC Docs - Wanderer's Guide", user: req.user });
});
router.get('/api_docs', (req, res) => {
  res.render('docs/api_docs', { title: "API Docs - Wanderer's Guide", user: req.user });
});
router.get('/guidechar_docs', (req, res) => {
  res.render('docs/guidechar_docs', { title: "Guidechar Docs - Wanderer's Guide", user: req.user });
});

module.exports = router;