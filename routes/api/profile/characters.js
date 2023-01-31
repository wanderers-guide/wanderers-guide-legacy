const express = require("express");

const Character = require("../../../models/contentDB/Character");
const Class = require("../../../models/contentDB/Class");
const Ancestry = require("../../../models/contentDB/Ancestry");
const Heritage = require("../../../models/contentDB/Heritage");
const UniHeritage = require("../../../models/contentDB/UniHeritage");
const CharStateUtils = require("../../../js/CharStateUtils");

const router = express.Router();

const authCheck = (req, res, next) => {
  let rSheetPageMatch = req.originalUrl.match(/\/profile\/characters\/\d+$/);
  if (!req.user && rSheetPageMatch == null) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, async (req, res) => {
  let [charactersRaw, classes, heritages, uniHeritages, ancestries] =
    await Promise.all([
      Character.findAll({
        where: { userID: req.user.id },
      }),
      Class.findAll(),
      Heritage.findAll(),
      UniHeritage.findAll(),
      Ancestry.findAll(),
    ]);

  const characters = charactersRaw.map((raw) => {
    const character = raw.dataValues;

    let cClass = classes.find((cClass) => {
      return cClass.id == character.classID;
    });

    character.className = cClass != null ? cClass.name : "";

    if (character.heritageID != null) {
      let heritage = heritages.find((heritage) => {
        return heritage.id == character.heritageID;
      });
      if (heritage != null) {
        character.heritageName = heritage.name;
      }
    } else if (character.uniHeritageID != null) {
      let heritageName = "";
      let uniHeritage = uniHeritages.find((uniHeritage) => {
        return uniHeritage.id == character.uniHeritageID;
      });

      if (uniHeritage != null) {
        heritageName = uniHeritage.name;
      }

      let ancestry = ancestries.find((ancestry) => {
        return ancestry.id == character.ancestryID;
      });

      heritageName += ancestry != null ? " " + ancestry.name : "";
      character.heritageName = heritageName;
    } else {
      let ancestry = ancestries.find((ancestry) => {
        return ancestry.id == character.ancestryID;
      });
      character.heritageName = ancestry != null ? ancestry.name : "";
    }

    character.isPlayable = CharStateUtils.isPlayable(character);

    return character;
  });

  res.json(characters);
});

module.exports = router;
