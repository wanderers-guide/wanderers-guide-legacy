
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
        if(character != null){
            if(CharStateUtils.isPublic(character) || (req.user != null && character.userID === req.user.id)){

                if(CharStateUtils.isPlayable(character)) {
                    goToCharSheet(character, req, res);
                } else {
                    res.redirect('/profile/characters/builder/'+character.id+'/page1');
                }
    
            } else {
                res.status(403); // 403 - Forbidden
                res.render('error/private_character_error', { title: "Private Character Error - Wanderer's Guide", user: req.user });
            }
        } else {
            res.status(403); // 403 - Forbidden, really a 404 - Not Found
            res.render('error/private_character_error', { title: "Private Character Error - Wanderer's Guide", user: req.user });
        }
    }).catch(err => {
        console.error(err);
        res.status(404); // 404 - Not Found
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