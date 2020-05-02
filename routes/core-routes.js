const router = require('express').Router();
const Background = require('../models/backgroundDB/HomeBackground');
const Sequelize = require('sequelize');

// create home route
router.get('/', (req, res) => {
    // Get single random background
    // Test Singles: where: { id: 60 }
    Background.findOne({ order: [ [ Sequelize.fn('RAND') ] ] }).then((background) => {
        res.render('home', { title: "Apeiron - Pathfinder 2e Character Manager", user: req.user, background });
    });
});

// create homebrew route
router.get('/homebrew', (req, res) => {
    res.render('homebrew', { title: "Homebrew - Apeiron", user: req.user });
});

// create upgrade route
router.get('/upgrade', (req, res) => {
    res.render('upgrade', { title: "Upgrade - Apeiron", user: req.user });
});

// create license route
router.get('/license', (req, res) => {
    res.render('license', { title: "License - Apeiron", user: req.user });
});

module.exports = router;