
const router = require('express').Router();
const Character = require('../models/contentDB/Character');
const CharStateUtils = require('../js/CharStateUtils');

const PATH = '/profile/characters/'; // <- Change this if routes are ever changed //
router.get('*', (req, res) => {

    let charID = parseInt(req.originalUrl.substring(PATH.length));

    /* The way this is designed allows someone to acquire data from all the character sheets. 
    If privatizing character data ever becomes important, we may want to change this. */
    Character.findOne({ where: { id: charID} })
    .then((character) => {

        if(character.userID === req.user.id){

            if(CharStateUtils.isPlayable(character)) {
                goToCharSheet(character, req, res);
            } else {
                res.redirect('/profile/characters/builder/'+character.id+'/page1');
            }

        } else {
            // When a user attempts to view a character sheet that isn't theirs, give them 404
            console.log("AUTH FAILURE - User attempted to view a character that isn't theirs!");
            res.status(404);
            res.render('error/404_error', { title: "404 Not Found - Wanderer's Guide", user: req.user });
        }

    }).catch(err => {
        console.log(err);
        res.status(404);
        res.render('error/404_error', { title: "404 Not Found - Wanderer's Guide", user: req.user });
    });

});


function goToCharSheet(character, req, res) {

    res.render('sheet/charsheet', {
        title: character.name+" - Wanderer's Guide",
        user: req.user
    });

}

module.exports = router;