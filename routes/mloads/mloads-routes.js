
const AuthCheck = require('./../../js/AuthCheck');
const CharGathering = require('./../../js/CharGathering');
const CharStateUtils = require('./../../js/CharStateUtils');
const BuildsGathering = require('./../../js/BuildsGathering');
const CharDataMapping = require('./../../js/CharDataMapping');

const CharSheetLoad = require('./../../js/loading/Load_CharSheet');
const NewBuilderCoreLoad = require('./../../js/loading/Load_NewBuilderCore');
const SearchLoad = require('./../../js/loading/Load_Search');

const router = require('express').Router();

router.get('/char-sheet', (req, res) => {

  let userID = (req.user != null) ? req.user.id : -1;
  let charID = parseInt(req.query.char_id); if(isNaN(charID)){charID=null;}
  if(charID == null){ res.sendStatus(401); return; }

  AuthCheck.getPermissions(userID).then((perms) => {
    AuthCheck.canEditCharacter(userID, charID).then((canEditChar) => {
      if(canEditChar){
        CharSheetLoad(userID, charID).then((charInfo) => {
          res.send({
            charInfo: charInfo,
            userPermissions: perms,
            viewOnly: false,
          });
        });
      } else {
        CharGathering.getCharacter(userID, charID).then((character) => {
          if(CharStateUtils.isPublic(character)){
            CharSheetLoad(userID, charID, character).then((charInfo) => {
              res.send({
                charInfo: charInfo,
                userPermissions: perms,
                viewOnly: true,
              });
            });
          } else {
            res.sendStatus(403);
          }
        });
      }
    });
  });

});

router.get('/char-builder', (req, res) => {

  let userID = (req.user != null) ? req.user.id : -1;
  let charID = parseInt(req.query.char_id); if(isNaN(charID)){charID=null;}
  let buildID = parseInt(req.query.build_id); if(isNaN(buildID)){buildID=null;}

  // If in Character Builder or Builder Creator mode
  if(charID != null){

    AuthCheck.canEditCharacter(userID, charID).then((canEditChar) => {
      if(canEditChar){

        // Repopulate unselectedData
        CharDataMapping.deleteDataBySource(charID, 'unselectedData')
        .then((result) => {
          
          NewBuilderCoreLoad(userID, charID, buildID).then((coreStruct) => {
            // Get Character to get the character's buildID (if it has one)
            CharGathering.getCharacter(userID, charID).then((character) => {
              BuildsGathering.getBuildInfo(character.buildID).then((buildInfo) => {
                res.send({
                  coreStruct: coreStruct,
                  buildInfo: buildInfo,
                });
              });
            });
          });

        });

      } else {
        res.sendStatus(403);
      }
    });

  } else {

    AuthCheck.canEditBuild(userID, buildID).then((editBuild) => {
      if(editBuild){

        NewBuilderCoreLoad(userID, charID, buildID).then((coreStruct) => {
          res.send({
            coreStruct: coreStruct,
            buildInfo: null,
          });
        });

      } else {
        res.sendStatus(403);
      }
    });

  }

});


router.get('/browse', (req, res) => {

  let userID = (req.user != null) ? req.user.id : -1;

  AuthCheck.isDeveloper(userID).then((isDeveloper) => {
    SearchLoad(userID).then((searchStruct) => {
      searchStruct.isDeveloper = isDeveloper;
      res.send(searchStruct);
    });
  });

});

module.exports = router;