const router = require("express").Router();
const Character = require("../models/contentDB/Character");

const CharStateUtils = require("../js/CharStateUtils");

const Class = require("../models/contentDB/Class");
const Ancestry = require("../models/contentDB/Ancestry");
const Heritage = require("../models/contentDB/Heritage");
const UniHeritage = require("../models/contentDB/UniHeritage");

router.get("/user", async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.render("error/500_error", {
      title: "500 Server Error - Wanderer's Guide",
      user: req.user,
    });
  }
});
router.get("/characters", async (req, res) => {
  // this is essentially the characters_list endpoint below, but just delivering data instead of a handlebars templateCharacter.findAll({ where: { userID: req.user.id } })
  try {
    const [characters, classes, heritages, uniheritages, ancestries] =
      await Promise.all([
        Character.findAll({ where: { userID: req.user.id }, raw: true }),
        Class.findAll({ raw: true }),
        Heritage.findAll({ raw: true }),
        UniHeritage.findAll({ raw: true }),
        Ancestry.findAll({ raw: true }),
      ]);

    for (let character of characters) {
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
        console.log(`set ${character.className} ${character.heritageName}`);
      }

      character.isPlayable = CharStateUtils.isPlayable(character);
    }

    res.status(200).json({
      characters,
      canMakeCharacter: CharStateUtils.canMakeCharacter(req.user, characters),
      characterLimit: CharStateUtils.getUserCharacterLimit(),
    });
  } catch (error) {
    console.error(error);
    res.status(500);
    res.render("error/500_error", {
      title: "500 Server Error - Wanderer's Guide",
      user: req.user,
    });
  }
});
module.exports = router;
