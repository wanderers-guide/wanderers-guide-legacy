
const router = require('express').Router();
const charbuilderRoutes = require('./charbuilder-routes');
const chardeleteRoutes = require('./chardelete-routes');
const charsheetRoutes = require('./charsheet-routes');

const Character = require('../models/contentDB/Character');

const CharSaving = require('../js/CharSaving');
const CharStateUtils = require('../js/CharStateUtils');

const Class = require('../models/contentDB/Class');
const Ancestry = require('../models/contentDB/Ancestry');
const Heritage = require('../models/contentDB/Heritage');
const UniHeritage = require('../models/contentDB/UniHeritage');

router.get('/', (req, res) => {

    Character.findAll({ where: { userID: req.user.id} })
    .then((characters) => {
        Class.findAll()
        .then((classes) => {
            Heritage.findAll()
            .then((heritages) => {
                UniHeritage.findAll()
                .then((uniHeritages) => {
                    Ancestry.findAll()
                    .then((ancestries) => {

                        for(let character of characters){
        
                            let cClass = classes.find(cClass => {
                                return cClass.id == character.classID;
                            });
                            character.className = (cClass != null) ? cClass.name : '';
        

                            if(character.heritageID != null){

                                let heritage = heritages.find(heritage => {
                                    return heritage.id == character.heritageID;
                                });
                                if(heritage != null) {
                                    character.heritageName = heritage.name;
                                }

                            } else if (character.uniHeritageID != null){

                                let heritageName = '';
                                let uniHeritage = uniHeritages.find(uniHeritage => {
                                    return uniHeritage.id == character.uniHeritageID;
                                });
                                if(uniHeritage != null) {
                                    heritageName = uniHeritage.name;
                                }

                                let ancestry = ancestries.find(ancestry => {
                                    return ancestry.id == character.ancestryID;
                                });
                                heritageName += (ancestry != null) ? ' '+ancestry.name : '';
                                character.heritageName = heritageName;

                            } else {

                                let ancestry = ancestries.find(ancestry => {
                                    return ancestry.id == character.ancestryID;
                                });
                                character.heritageName = (ancestry != null) ? ancestry.name : '';

                            }
        
                            character.isPlayable = CharStateUtils.isPlayable(character);
        
                        }
                        
                        res.render('pages/character_list', {
                            title: "Your Characters - Wanderer's Guide",
                            user: req.user,
                            characters,
                            canMakeCharacter: CharStateUtils.canMakeCharacter(req.user, characters),
                            characterLimit: CharStateUtils.getUserCharacterLimit()});

                    });
                });
            });
        });

    }).catch((error) => {
        console.error(error);
        res.status(500);
        res.render('error/500_error', { title: "500 Server Error - Wanderer's Guide", user: req.user });
    });

});

router.get('/add', (req, res) => {
  CharSaving.createNewCharacter(req.user)
  .then((character) => {
    if(character != null){
      res.redirect('/profile/characters/builder/basics/?id='+character.id);
    } else {
      // Cannot make another character, goto 404 not found
      res.status(404);
      res.render('error/404_error', { title: "404 Not Found - Wanderer's Guide", user: req.user });
    }
  });
});

router.use('/delete', chardeleteRoutes);

router.use('/builder', charbuilderRoutes);

router.use('*', charsheetRoutes);

module.exports = router;