/* Copyright (C) 2019, Apeiron, all rights reserved.
    Made by Aaron Cassar.
*/

const router = require('express').Router();
const charbuilderRoutes = require('./charbuilder-routes');
const charsheetRoutes = require('./charsheet-routes');

const Character = require('../models/contentDB/Character');
const CharData = require('../models/contentDB/CharData');

const CharSaving = require('../js/CharSaving');

const Class = require('../models/contentDB/Class');
const Background = require('../models/contentDB/Background');
const Ancestry = require('../models/contentDB/Ancestry');
const Inventory = require('../models/contentDB/Inventory');

router.get('/', (req, res) => {

    Character.findAll({ where: { userID: req.user.id} })
    .then((characters) => {

        res.render('characters', { title: "Your Characters - Apeiron", user: req.user, characters });

    }).catch((error) => {
        console.error(error);
        res.status(500);
        res.render('500_error', { title: "500 Server Error - Apeiron", user: req.user });
    });

});

router.get('/add', (req, res) => {

    Inventory.create({
    }).then(inventory => {
        CharSaving.addItemToInv(inventory.id, 23, 150)
        .then( result => {
            CharData.create({
            }).then(charData => {
                Character.create({
                    name: "Unnamed Character",
                    level: 1,
                    userID: req.user.id,
                    ancestryID: 1,
                    heritageID: 1,
                    inventoryID: inventory.id,
                    dataID: charData.id
                }).then(character => {
                    res.redirect('/profile/characters/builder/'+character.id+'/page1');
                }).catch(err => console.log(err));
            });
        });
    });
    
});

router.use('/builder', charbuilderRoutes);

router.use('*', charsheetRoutes);

module.exports = router;