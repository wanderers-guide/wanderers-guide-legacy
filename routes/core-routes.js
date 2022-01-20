const router = require('express').Router();
const Background = require('../models/backgroundDB/HomeBackground');
const Sequelize = require('sequelize');

const homebrewRoutes = require('./homebrew/homebrew-routes');
const buildsRoutes = require('./builds/builds-routes');

// Home Route
router.get('/', (req, res) => {

  let goToHomepage = function(user, background){

    res.render('pages/home', {
      title: "Wanderer's Guide - Pathfinder 2e Character Manager",
      user,
      background,
    });

  };

  // Get random (or by ID) background //
  let backgroundID = parseInt(req.query.bck_id); if(isNaN(backgroundID)){backgroundID=null;}
  if(backgroundID != null){

    Background.findOne({ where: { id: backgroundID } }).then((background) => {
      goToHomepage(req.user, background);
    }).catch((error) => {
      res.render('pages/website_down', { title: "Website Down - Wanderer's Guide" });
    });

  } else {

    // Get single random background
    Background.findOne({ order: [ [ Sequelize.fn('RAND') ] ] }).then((background) => {
      goToHomepage(req.user, background);
    }).catch((error) => {
      console.log(error);
      res.render('pages/website_down', { title: "Website Down - Wanderer's Guide" });
    });

  }

});

// Direct Builds Route
router.use('/builds', buildsRoutes);

// Direct Homebrew Route
router.use('/homebrew', homebrewRoutes);

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

// Material Stats Route
router.get('/material_stats', (req, res) => {
  res.render('pages/material_stats', { title: "Material Stats - Wanderer's Guide", user: req.user });
});

// Build Planner Route
/*
router.get('/build_planner', (req, res) => {
  res.render('pages/build_planner', { title: "Create Your Build - Wanderer's Guide", user: req.user });
});*/

module.exports = router;