
const router = require('express').Router();

const HomebrewBundle = require('../../models/contentDB/HomebrewBundle');
const Class = require('../../models/contentDB/Class');
const ClassAbility = require('../../models/contentDB/ClassAbility');
const Background = require('../../models/contentDB/Background');
const Ancestry = require('../../models/contentDB/Ancestry');
const Heritage = require('../../models/contentDB/Heritage');
const Item = require('../../models/contentDB/Item');
const Spell = require('../../models/contentDB/Spell');
const Language = require('../../models/contentDB/Language');
const Tag = require('../../models/contentDB/Tag');
const SenseType = require('../../models/contentDB/SenseType');
const PhysicalFeature = require('../../models/contentDB/PhysicalFeature');
const Feat = require('../../models/contentDB/Feat');
const Skill = require('../../models/contentDB/Skill');
const Archetype = require('../../models/contentDB/Archetype');
const UniHeritage = require('../../models/contentDB/UniHeritage');

router.get('/', (req, res) => {

  let editHomebrewID = parseInt(req.query.edit_id); if(isNaN(editHomebrewID)){editHomebrewID=null;}
  let viewHomebrewID = parseInt(req.query.view_id); if(isNaN(viewHomebrewID)){viewHomebrewID=null;}

  res.render('pages/homebrew', { title: "Homebrew - Wanderer's Guide", user: req.user, editHomebrewID, viewHomebrewID });
});

const bundleAuthCheck = (req, res, next) => {
  let bundleID = parseInt(req.query.id);
  if(isNaN(bundleID)){
    res.redirect('/homebrew');
  } else {
    HomebrewBundle.findOne({ where: { id: bundleID, userID: req.user.id } })
    .then((homebrewBundle) => {
      if(homebrewBundle.isPublished === 0) {
        next();
      } else {
        res.redirect('/homebrew');
      }
    }).catch((error) => {
      res.redirect('/homebrew');
    });
  }
};

// Class Builder
router.get('/create/class', bundleAuthCheck, (req, res) => {

    let bundleID = parseInt(req.query.id); if(isNaN(bundleID)){bundleID=null;}

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        Item.findAll({
            where: { isArchived: 0, hidden: 0, itemStructType: 'WEAPON' },
            order: [['name', 'ASC'],]
        }).then((weaponItems) => {
            res.render('homebrew/builder_class', {
                title: "Class Builder - Wanderer's Guide",
                user: req.user,
                tags,
                weaponItems,
                bundleID: bundleID,
            });
        });
    });

});

router.get('/edit/class', bundleAuthCheck, (req, res) => {

  let bundleID = parseInt(req.query.id); if(isNaN(bundleID)){bundleID=null;}
  let classID = parseInt(req.query.class_id); if(isNaN(classID)){classID=null;}

  Tag.findAll({
      where: { isArchived: 0, isHidden: 0 },
      order: [['name', 'ASC'],]
  }).then((tags) => {
      Item.findAll({
          where: { isArchived: 0, hidden: 0, itemStructType: 'WEAPON' },
          order: [['name', 'ASC'],]
      }).then((weaponItems) => {
          res.render('homebrew/builder_class', {
              title: "Class Builder - Wanderer's Guide",
              user: req.user,
              tags,
              weaponItems,
              classID: classID,
              bundleID: bundleID,
          });
      });
  });
  
});

module.exports = router;