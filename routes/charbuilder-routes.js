/* Copyright (C) 2019, Apeiron, all rights reserved.
    Made by Aaron Cassar.
*/

const router = require('express').Router();
const Character = require('../models/contentDB/Character');

const Class = require('../models/contentDB/Class');
const Background = require('../models/contentDB/Background');
const Ancestry = require('../models/contentDB/Ancestry');

const CharGathering = require('../js/CharGathering');

const PATH = '/profile/characters/builder/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    let splitData = extraData.split("/");

    let charID = parseInt(splitData[0]);
    let buildPage = splitData[1];

    console.log(extraData+" "+charID+" "+buildPage);

    if(buildPage != null) {

        if(buildPage === "page1" || buildPage === "page1?") {
            goToBuilder(req, res, 'char_builder_1', charID);
        } else if (buildPage === "page2" || buildPage === "page2?") {
            goToBuilder(req, res, 'char_builder_2', charID);
        } else if (buildPage === "page3" || buildPage === "page3?") {
            goToBuilder(req, res, 'char_builder_3', charID);
        } else if (buildPage === "page4" || buildPage === "page4?") {
            goToBuilder(req, res, 'char_builder_4', charID);
        } else if (buildPage === "page5" || buildPage === "page5?") {
            goToBuilder(req, res, 'char_builder_5', charID);
        } else {
            res.status(404);
            res.render('404_error', { title: "404 Not Found - Apeiron", user: req.user });
        }

    } else {
        res.status(404);
        res.render('404_error', { title: "404 Not Found - Apeiron", user: req.user });
    }

});

function goToBuilder(req, res, buildStageName, charID){

    /* The way this is designed allows someone to acquire data from all the characters. 
    If privatizing character data ever becomes important, we may want to change this. */
    Character.findOne({ where: { id: charID} })
    .then((character) => {

        if(character.userID === req.user.id){

            Class.findAll().then((allClasses) => {
                Background.findAll().then((allBackgrounds) => {
                    Ancestry.findAll().then((allAncestries) => {

                        CharGathering.getAllCharacterBuilderInfo(character).then((cInfo) => {

                            res.render(buildStageName, {
                                title: "Character Builder - Apeiron",
                                user: req.user,
                                character: cInfo.char,
                                charClass: cInfo.cClass,
                                charBackground: cInfo.background,
                                charAncestry: cInfo.ancestry,
                                charHeritage: cInfo.heritage,
                                charAbilities: cInfo.charAbilities,
                                allClasses,
                                allBackgrounds,
                                allAncestries
                            });

                        });
        
                    });
                });
            });

        } else {
            // When a user attempts to view a character builder that isn't theirs, give them 404
            res.status(404);
            res.render('404_error', { title: "404 Not Found - Apeiron", user: req.user });
        }

    }).catch(err => {
        res.status(404);
        res.render('404_error', { title: "404 Not Found - Apeiron", user: req.user });
    });

}

module.exports = router;