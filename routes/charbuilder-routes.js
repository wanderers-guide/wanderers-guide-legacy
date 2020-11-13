
const router = require('express').Router();
const Character = require('../models/contentDB/Character');

const CharStateUtils = require('../js/CharStateUtils');
const CharGathering = require('../js/CharGathering');

router.get('/basics', (req, res) => {

  let charID = parseInt(req.query.id); if(isNaN(charID)){charID=null;}

  Character.findOne({ where: { id: charID, userID: req.user.id } })
  .then((character) => {
    if(character != null){

      CharGathering.getBaseAbilityScores(character.id)
      .then((charAbilityScores) => {
        let isPlayable = CharStateUtils.isPlayable(character);

        res.render('char_builder/char_builder_init', {
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

});

router.get('/', (req, res) => {

  let charID = parseInt(req.query.id); if(isNaN(charID)){charID=null;}
  let pageNum = parseInt(req.query.page); if(isNaN(pageNum)){pageNum=null;}

  Character.findOne({ where: { id: charID, userID: req.user.id } })
  .then((character) => {
    if(character != null){

      CharGathering.getBaseAbilityScores(character.id)
      .then((charAbilityScores) => {
        let isPlayable = CharStateUtils.isPlayable(character);

        res.render('char_builder/char_builder', {
          title: "Character Builder - Wanderer's Guide",
          user: req.user,
          character: character,
          charAbilities: charAbilityScores,
          isPlayable: isPlayable,
          pageNum: pageNum,
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

});

module.exports = router;