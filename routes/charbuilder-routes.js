
const router = require('express').Router();
const Character = require('../models/contentDB/Character');

const CharStateUtils = require('../js/CharStateUtils');
const CharGathering = require('../js/CharGathering');

const PATH = '/profile/characters/builder/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    let splitData = extraData.split("/");

    let charID = parseInt(splitData[0]);
    let buildPage = splitData[1];

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
            res.render('error/404_error', { title: "404 Not Found - Wanderer's Guide", user: req.user });
        }

    } else {
        res.status(404);
        res.render('error/404_error', { title: "404 Not Found - Wanderer's Guide", user: req.user });
    }

});

function goToBuilder(req, res, buildStageName, charID){

    /* The way this is designed allows someone to acquire data from all the characters. 
    If privatizing character data ever becomes important, we may want to change this. */
    Character.findOne({ where: { id: charID} })
    .then((character) => {

        if(character.userID === req.user.id){

            CharGathering.getBaseAbilityScores(character.id)
            .then((charAbilityScores) => {

                let isPlayable = CharStateUtils.isPlayable(character);

                res.render('char_builder/'+buildStageName, {
                    title: "Character Builder - Wanderer's Guide",
                    user: req.user,
                    character: character,
                    charAbilities: charAbilityScores,
                    isPlayable: isPlayable,
                });

            });

        } else {
            res.status(403); // 403 - Forbidden
            res.render('error/403_builder_error', { title: "Character Builder - Wanderer's Guide", user: req.user });
        }

    }).catch(err => {
        res.status(404); // 404 - Not Found
        res.render('error/404_error', { title: "404 Not Found - Wanderer's Guide", user: req.user });
    });

}

module.exports = router;