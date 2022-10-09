
const router = require('express').Router();

const Character = require('../models/contentDB/Character');

const CharStateUtils = require('../js/CharStateUtils');
const AuthCheck = require('../js/AuthCheck');

const PATH = '/profile/characters/'; // <- Change this if routes are ever changed //
router.get('*', (req, res) => {

    let charID = parseInt(req.originalUrl.substring(PATH.length));
    let sheetType = req.query.type;

    /* The way this is designed allows someone to acquire data from all the character sheets. 
    If privatizing character data ever becomes important, we may want to change this. */
    Character.findOne({ where: { id: charID} })
    .then((character) => {
        if(character != null){

          let userID = (req.user?.id) ? req.user.id : -1;

          AuthCheck.canViewCharacter(userID, character.id).then((canViewChar) => {
            if(canViewChar){

              AuthCheck.canEditCharacter(userID, character.id).then((canEditChar) => {

                if(CharStateUtils.isPlayable(character)) {
                  goToCharSheet(character, req, res, !canEditChar, sheetType);
                } else {
                  res.redirect('/profile/characters/builder/basics/?id='+character.id);
                }

              });

            } else {
              res.status(403); // 403 - Forbidden
              res.render('error/private_character_error', { title: "Private Character Error - Wanderer's Guide", user: req.user });
            }
          });

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


function goToCharSheet(character, req, res, isRestrictedView, sheetType) {
  // IN-PROGRESS

  let title;

  if(sheetType == 'export_to_pdf'){
    title = "[Export-to-PDF] "+character.name+" - Wanderer's Guide";
    res.render('sheet/sheet_to_pdf', {
      title: title,
      user: req.user
    });
    return;
  }

  if(isRestrictedView) {
    title = "[View-Only] "+character.name+" - Wanderer's Guide";
  } else {
    title = character.name+" - Wanderer's Guide";
  }

  res.render('sheet/charsheet', {
    title: title,
    user: req.user
  });

}

module.exports = router;