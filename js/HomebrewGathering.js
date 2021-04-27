const { Op } = require("sequelize");

const Condition = require('../models/contentDB/Condition');
const Class = require('../models/contentDB/Class');
const ClassAbility = require('../models/contentDB/ClassAbility');
const Archetype = require('../models/contentDB/Archetype');
const Feat = require('../models/contentDB/Feat');
const FeatTag = require('../models/contentDB/FeatTag');
const Tag = require('../models/contentDB/Tag');
const Spell = require('../models/contentDB/Spell');
const TaggedSpell = require('../models/contentDB/TaggedSpell');
const Skill = require('../models/contentDB/Skill');
const Background = require('../models/contentDB/Background');
const Language = require('../models/contentDB/Language');
const Ancestry = require('../models/contentDB/Ancestry');
const Heritage = require('../models/contentDB/Heritage');
const UniHeritage = require('../models/contentDB/UniHeritage');
const AncestryLanguage = require('../models/contentDB/AncestryLanguage');
const AncestryBoost = require('../models/contentDB/AncestryBoost');
const AncestryFlaw = require('../models/contentDB/AncestryFlaw');
const SenseType = require('../models/contentDB/SenseType');
const Item = require('../models/contentDB/Item');
const Weapon = require('../models/contentDB/Weapon');
const DamageType = require('../models/contentDB/DamageType');
const TaggedItem = require('../models/contentDB/TaggedItem');
const Armor = require('../models/contentDB/Armor');
const Storage = require('../models/contentDB/Storage');
const Shield = require('../models/contentDB/Shield');
const ItemRune = require('../models/contentDB/ItemRune');
const SheetState = require("../models/contentDB/SheetState");

module.exports = class HomebrewGathering {

  static getAllClasses(homebrewID) {
    return Class.findAll({ order: [['name', 'ASC'],], where: { homebrewID: homebrewID } })
    .then((classes) => {
      return classes;
    });
  }

  static getAllAncestries(homebrewID) {
    return Ancestry.findAll({ order: [['name', 'ASC'],], where: { homebrewID: homebrewID } })
    .then((ancestries) => {
      return ancestries;
    });
  }

  static getAllArchetypes(homebrewID) {
    return Archetype.findAll({ order: [['name', 'ASC'],], where: { homebrewID: homebrewID } })
    .then((archetypes) => {
      return archetypes;
    });
  }

  static getAllBackgrounds(homebrewID) {
    return Background.findAll({ order: [['name', 'ASC'],], where: { homebrewID: homebrewID } })
    .then((backgrounds) => {
      return backgrounds;
    });
  }

  static getAllClassFeatures(homebrewID) {
    return ClassAbility.findAll({
      order: [['name', 'ASC'],],
      where: { homebrewID: homebrewID } // indivClassName: { [Op.ne]: null }, selectOptionFor: null
    }).then((classFeatures) => {
      return classFeatures;
    });
  }

  static getAllFeats(homebrewID) {
    Feat.hasMany(FeatTag, {foreignKey: 'featID'});
    FeatTag.belongsTo(Feat, {foreignKey: 'featID'});
    return Feat.findAll({
      order: [['name', 'ASC'],],
      where: { homebrewID: homebrewID }, // genericType: { [Op.ne]: null }
      include: [FeatTag]
    }).then((feats) => {
      return feats;
    });
  }

  static getAllHeritages(homebrewID) {
    return Heritage.findAll({
      order: [['name', 'ASC'],],
      where: { homebrewID: homebrewID } }) // indivAncestryName: { [Op.ne]: null }
    .then((heritages) => {
      return heritages;
    });
  }

  static getAllUniHeritages(homebrewID) {
    return UniHeritage.findAll({ order: [['name', 'ASC'],], where: { homebrewID: homebrewID } })
    .then((uniheritages) => {
      return uniheritages;
    });
  }

  static getAllLanguages(homebrewID) {
    return Language.findAll({ order: [['name', 'ASC'],], where: { homebrewID: homebrewID } })
    .then((languages) => {
      return languages;
    });
  }

  static getAllItems(homebrewID){
    Item.hasMany(TaggedItem, {foreignKey: 'itemID'});
    TaggedItem.belongsTo(Item, {foreignKey: 'itemID'});
    return Item.findAll({
      order: [['name', 'ASC'],],
      where: { homebrewID: homebrewID },
      include: [TaggedItem]
    }).then((items) => {
      return Weapon.findAll()
      .then((weapons) => {
          return Armor.findAll()
          .then((armors) => {
              return Storage.findAll()
              .then((storages) => {
                  return Shield.findAll()
                  .then((shields) => {
                      return ItemRune.findAll()
                      .then((runes) => {
                                  
                          let itemArray = [];

                          for(const item of items){

                              let weapon = weapons.find(weapon => {
                                  return weapon.itemID == item.id;
                              });

                              let armor = armors.find(armor => {
                                  return armor.itemID == item.id;
                              });

                              let storage = storages.find(storage => {
                                  return storage.itemID == item.id;
                              });

                              let shield = shields.find(shield => {
                                  return shield.itemID == item.id;
                              });

                              let rune = runes.find(rune => {
                                  return rune.itemID == item.id;
                              });

                              itemArray.push({
                                  Item : item,
                                  WeaponData : weapon,
                                  ArmorData : armor,
                                  StorageData : storage,
                                  ShieldData : shield,
                                  RuneData : rune,
                              });

                          }

                          return itemArray;
                      });
                  });
              });
          });
      });
    });
  }

  static getAllSpells(homebrewID) {
    Spell.hasMany(TaggedSpell, {foreignKey: 'spellID'});
    TaggedSpell.belongsTo(Spell, {foreignKey: 'spellID'});
    return Spell.findAll({
      order: [['name', 'ASC'],],
      where: { homebrewID: homebrewID },
      include: [TaggedSpell]
    }).then((spells) => {
      return spells;
    });
  }

  static getAllToggleables(homebrewID) {
    return SheetState.findAll({
      order: [['name', 'ASC'],],
      where: { homebrewID: homebrewID },
    }).then((toggleables) => {
      return toggleables;
    });
  }

};