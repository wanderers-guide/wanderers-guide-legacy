const router = require('express').Router();
const Background = require('../models/backgroundDB/HomeBackground');
const Sequelize = require('sequelize');

// create home route
router.get('/', (req, res) => {
    // Get single random background
    // Test Singles: where: { id: 60 }

    Background.findOne({ order: [ [ Sequelize.fn('RAND') ] ] }).then((background) => {
        res.render('pages/home', { title: "Wanderer's Guide - Pathfinder 2e Character Manager", user: req.user, background });
    });
});

// create homebrew route
router.get('/homebrew', (req, res) => {
    res.render('pages/homebrew', { title: "Homebrew - Wanderer's Guide", user: req.user });
});

// create browse route
router.get('/browse', (req, res) => {
    res.render('pages/browse', { title: "Browse - Wanderer's Guide", user: req.user });
});

// create license route
router.get('/license', (req, res) => {
    res.render('pages/license', { title: "License - Wanderer's Guide", user: req.user });
});

// create docs route
router.get('/wsc_docs', (req, res) => {
    res.render('pages/wsc_docs', { title: "WSC Docs - Wanderer's Guide", user: req.user });
});

module.exports = router;