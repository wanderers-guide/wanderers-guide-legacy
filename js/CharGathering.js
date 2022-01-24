
const { Op } = require("sequelize");

const Character = require('../models/contentDB/Character');
const Class = require('../models/contentDB/Class');
const ClassAbility = require('../models/contentDB/ClassAbility');
const Archetype = require('../models/contentDB/Archetype');
const Feat = require('../models/contentDB/Feat');
const FeatTag = require('../models/contentDB/FeatTag');
const Tag = require('../models/contentDB/Tag');
const Domain = require('../models/contentDB/Domain');
const Spell = require('../models/contentDB/Spell');
const InnateSpellCasting = require('../models/contentDB/InnateSpellCasting');
const TaggedSpell = require('../models/contentDB/TaggedSpell');
const Skill = require('../models/contentDB/Skill');
const Background = require('../models/contentDB/Background');
const NoteField = require('../models/contentDB/NoteField');
const Inventory = require('../models/contentDB/Inventory');
const Language = require('../models/contentDB/Language');
const Ancestry = require('../models/contentDB/Ancestry');
const Heritage = require('../models/contentDB/Heritage');
const UniHeritage = require('../models/contentDB/UniHeritage');
const AncestryLanguage = require('../models/contentDB/AncestryLanguage');
const AncestryBoost = require('../models/contentDB/AncestryBoost');
const AncestryFlaw = require('../models/contentDB/AncestryFlaw');
const SenseType = require('../models/contentDB/SenseType');
const PhysicalFeature = require('../models/contentDB/PhysicalFeature');
const Condition = require('../models/contentDB/Condition');
const CharCondition = require('../models/contentDB/CharCondition');
const Item = require('../models/contentDB/Item');
const InvItem = require('../models/contentDB/InvItem');
const Weapon = require('../models/contentDB/Weapon');
const DamageType = require('../models/contentDB/DamageType');
const TaggedItem = require('../models/contentDB/TaggedItem');
const Armor = require('../models/contentDB/Armor');
const Storage = require('../models/contentDB/Storage');
const Shield = require('../models/contentDB/Shield');
const ItemRune = require('../models/contentDB/ItemRune');
const Book = require('../models/contentDB/Book');
const ClassArchetype = require('../models/contentDB/ClassArchetype');
const AnimalCompanion = require('../models/contentDB/AnimalCompanion');
const CharAnimalCompanion = require('../models/contentDB/CharAnimalCompanion');
const SpecificFamiliar = require('../models/contentDB/SpecificFamiliar');
const FamiliarAbility = require('../models/contentDB/FamiliarAbility');
const CharFamiliar = require('../models/contentDB/CharFamiliar');
const CharDataMappingModel = require('../models/contentDB/CharDataMapping');
const CalculatedStat = require('../models/contentDB/CalculatedStat');
const SheetState = require("../models/contentDB/SheetState");

const CharDataMapping = require('./CharDataMapping');
const CharDataMappingExt = require('./CharDataMappingExt');

const CharContentSources = require('./CharContentSources');
const CharContentHomebrew = require('./CharContentHomebrew');

const TempUnpublishedBooks = require('./TempUnpublishedBooks');

const UserHomebrew = require('./UserHomebrew');

const CharSpells = require('./CharSpells');
const CharTags = require('./CharTags');

const { Prisma } = require('./PrismaConnection');
const { raw } = require("@prisma/client/runtime");

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
}

function objToMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
}

function srcStructToCode(charID, source, srcStruct) {
    if(srcStruct == null){ return -1; }
    return hashCode(charID+'-'+source+'-'+srcStruct.sourceType+'-'+srcStruct.sourceLevel+'-'+srcStruct.sourceCode+'-'+srcStruct.sourceCodeSNum);
}

function hashCode(str) {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

function getUpAmt(profType){
    if(profType == "UP"){
        return 1;
    }
    if(profType == "DOWN"){
        return -1;
    }
    return 0;
}


function profTypeToNumber(profType){
  switch(profType){
    case 'U': return 0;
    case 'T': return 1;
    case 'E': return 2;
    case 'M': return 3;
    case 'L': return 4;
    default: return -1; 
  }
}

function profTypeFromNumber(numUps) {
  switch(numUps) {
    case 0: return "U";
    case 1: return "T";
    case 2: return "E";
    case 3: return "M";
    case 4: return "L";
    default: return "?";
  }
}

function getBetterProf(prof1, prof2){
    let profNumber1 = profTypeToNumber(prof1);
    let profNumber2 = profTypeToNumber(prof2);
    return (profNumber1 > profNumber2) ? prof1 : prof2;
}

function getInnateSpellCastingID(innateSpell){
    return innateSpell.charID+':'+innateSpell.source+':'+innateSpell.sourceType+':'+innateSpell.sourceLevel+':'+innateSpell.sourceCode+':'+innateSpell.sourceCodeSNum+':'+innateSpell.SpellID+':'+innateSpell.SpellLevel+':'+innateSpell.SpellTradition+':'+innateSpell.TimesPerDay;
}

function capitalizeWords(str){
    if(str == null){ return null;}
    return str.toLowerCase().replace(/(?:^|\s|["([{_-])+\S/g, match => match.toUpperCase());
  }

module.exports = class CharGathering {

    static getAllMetadata(userID, charID){
      return CharDataMappingModel.findAll({ where: { charID: charID } })
      .then((charMetaDatas) => {
        return charMetaDatas;
      });
    }

    static getCalculatedStats(userID, charID){
      return CalculatedStat.findOne({ where: { charID: charID } })
      .then((calculatedStats) => {
        return calculatedStats;
      });
    }

    static getSourceBooks(userID, enabledSources, enabledHomebrew){
      return Book.findAll({
        where: {
          codeName: {
            [Op.or]: CharContentSources.getSourceArray(enabledSources)
          },
          [Op.not]: [
            { codeName: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
          ]
        }
      }).then((books) => {
        return UserHomebrew.getCollectedHomebrewBundles(userID).then((hBundles) => {
          return UserHomebrew.getIncompleteHomebrewBundles(userID).then((progessBundles) => {
            try {
              const homebrewBundleArray = JSON.parse(enabledHomebrew);
              for(const hBundle of hBundles) {
                if(homebrewBundleArray.includes(hBundle.homebrewBundle.id)) {
                  books.push({
                    name: hBundle.homebrewBundle.name,
                    code: hBundle.homebrewBundle.code
                  });
                }
              }
              for(const progressBundle of progessBundles) {
                if(homebrewBundleArray.includes(progressBundle.id)) {
                  books.push({
                    name: progressBundle.name,
                    code: progressBundle.code
                  });
                }
              }
            } catch (err) {}
            return books;
          });
        });
      });
    }

    static getAllClassArchetypes(userID, enabledSources, enabledHomebrew) {
      return ClassArchetype.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
        }
      }).then((classArchetypes) => {
        return classArchetypes;
      });
    }

    static getAllClasses(userID, enabledSources, enabledHomebrew) {
      return Class.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
        }
      }).then((classes) => {
        return ClassAbility.findAll({
            order: [['level', 'ASC'],['name', 'ASC'],],
            where: {
                contentSrc: {
                  [Op.or]: CharContentSources.getSourceArray(enabledSources)
                },
                homebrewID: {
                  [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                },
                [Op.not]: [
                  { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
                ]
            }
        })
        .then((allClassAbilities) => {
            
            let classMap = new Map();

            for (const cClass of classes) {
                classMap.set(cClass.id, {Class : cClass, Abilities : []}); 
            }

            for (const classAbil of allClassAbilities) {
                let classID = classAbil.classID;

                if(classID == null && classAbil.indivClassName != null){
                    let cClass = classes.find(cClass => {
                        return cClass.name === classAbil.indivClassName;
                    });
                    if(cClass != null){
                        classID = cClass.id;
                    }
                }

                let classStruct = classMap.get(classID);
                if(classStruct != null){
                    classStruct.Abilities.push(classAbil);
                }

            }

            return mapToObj(classMap);

        });
      });
    }

    static async getAllClassFeatureOptions(userID, enabledSources, enabledHomebrew) {

      return await Prisma.classAbilities.findMany({
        where: {
          selectType: 'SELECT_OPTION',
          AND: [
            {OR: CharContentSources.getSourceArrayPrisma(enabledSources)},
            {OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)},
            {NOT: TempUnpublishedBooks.getSourcesArrayPrisma(userID)}
          ],
        },
        orderBy: [{ level: 'asc' },{ name: 'asc' }],
      });

    }

    static getAllExtraClassFeatures(userID, charID){
      return CharDataMapping.getDataAll(charID, 'classAbilityExtra', ClassAbility)
      .then((extraClassFeaturesArray) => {
        return extraClassFeaturesArray;
      });
    }

    static getAllArchetypes(userID, enabledSources, enabledHomebrew) {
      return Archetype.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
        },
      })
      .then((archetypes) => {
        return archetypes;
      });
    }

    static getAllUniHeritages(userID, enabledSources, enabledHomebrew) {
      return UniHeritage.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
        },
        order: [['name', 'ASC'],]
      })
      .then((uniHeritages) => {
          return uniHeritages;
      });
    }

    static async getAllFeats(userID, enabledSources, enabledHomebrew, feats=null, tags=null) {

      if(feats==null){
        feats = await Prisma.feats.findMany({
          where: {
            AND: [
              {OR: CharContentSources.getSourceArrayPrisma(enabledSources)},
              {OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)},
              {NOT: TempUnpublishedBooks.getSourcesArrayPrisma(userID)}
            ],
          },
          include: { featTags: true },
        });
      }

      if(tags==null){
        tags = await CharGathering.getAllTags(userID, enabledHomebrew);
      }


      let featMap = new Map();

      for (const feat of feats) {
          let fTags = [];
          /*
              If a feat has a genTypeName then it's a single feat for a class, ancestry, or uniHeritage.
              Search and give it the trait for that class, ancestry, or uniHeritage.
          */
          if(feat.genTypeName != null){
              let tag = tags.find(tag => {
                  if(tag.isArchived == 0){
                      return tag.name === feat.genTypeName;
                  } else {
                      return false;
                  }
              });
              if(tag != null){
                  fTags.push(tag);
              }
          }

          // Add Tags from FeatTags
          for(const featTag of feat.featTags) {
            let tag = tags.find(tag => {
              return tag.id === featTag.tagID;
            });
            if(tag != null){
              fTags.push(tag);
            }
          }

          // Fix Prisma @map issue
          if(feat.genericType != null){
            feat.genericType = feat.genericType.replace('_','-');
          }

          featMap.set(feat.id, {Feat : feat, Tags : fTags});

      }

      return mapToObj(featMap);

    }

    static async getAllSpells(userID, enabledSources, enabledHomebrew, spells=null, taggedSpells=null, tags=null) {

      if(spells==null){
        spells = await Prisma.spells.findMany({
          where: {
            AND: [
              {OR: CharContentSources.getSourceArrayPrisma(enabledSources)},
              {OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)},
              {NOT: TempUnpublishedBooks.getSourcesArrayPrisma(userID)}
            ],
          },
          orderBy: [{ level: 'asc' },{ name: 'asc' }],
        });
      }

      if(taggedSpells==null){
        taggedSpells = await TaggedSpell.findAll();
      }

      if(tags==null){
        tags = await CharGathering.getAllTags(userID, enabledHomebrew);
      }

      // Processing Spells Data //

      let spellMap = new Map();
    
      for (const spell of spells) {
        spellMap.set(spell.id, {Spell : spell, Tags : []});
      }

      for (const taggedSpell of taggedSpells) {

        let tag = tags.find(tag => {
          return tag.id === taggedSpell.tagID;
        });

        let spellStruct = spellMap.get(taggedSpell.spellID);
        if(spellStruct != null){
          spellStruct.Tags.push(tag);
        }

      }

      return spellMap;

    }

    static async getAllItems(userID, enabledSources, enabledHomebrew, items=null, tags=null){
        
        if(items==null){
          items = await Prisma.items.findMany({
            where: {
              AND: [
                {OR: CharContentSources.getSourceArrayPrisma(enabledSources)},
                {OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)},
                {NOT: TempUnpublishedBooks.getSourcesArrayPrisma(userID)}
              ],
            },
            include: {
              taggedItems: true,
              weapons: true,
              armors: true,
              storages: true,
              shields: true,
              itemRunes: true,
            },
          });
        }

        if(tags==null){
            tags = await CharGathering.getAllTags(userID, enabledHomebrew);
        }

        // Processing Item Data //

        let itemMap = new Map();
        for(const item of items){

          let tagArray = [];
          for(const taggedItem of item.taggedItems){
            if(taggedItem.itemID == item.id) {

              let tag = tags.find(tag => {
                return tag.id == taggedItem.tagID;
              });

              tagArray.push(tag);

            }
          }

          let weapon = item.weapons.find(weapon => {
            return weapon.itemID == item.id;
          });

          let armor = item.armors.find(armor => {
            return armor.itemID == item.id;
          });

          let storage = item.storages.find(storage => {
            return storage.itemID == item.id;
          });

          let shield = item.shields.find(shield => {
            return shield.itemID == item.id;
          });

          let rune = item.itemRunes.find(rune => {
            return rune.itemID == item.id;
          });

          // Fix Prisma @map issue
          if(armor != null && armor.armorType == 'N_A'){
            armor.armorType = 'N/A';
          }

          itemMap.set(item.id, {
            Item : item,
            WeaponData : weapon,
            ArmorData : armor,
            StorageData : storage,
            ShieldData : shield,
            RuneData : rune,
            TagArray : tagArray
          });

        }

        return itemMap;
        
    }

    static getInvItem(userID, invItemID){
      return InvItem.findOne({ where: { id: invItemID } })
      .then((invItem) => {
        return invItem;
      });
    }

    static getInvIDFromInvItemID(userID, invItemID){
      return InvItem.findOne({ where: { id: invItemID } })
      .then((invItem) => {
        if(invItem != null){
          return invItem.invID;
        } else {
          return null;
        }
      });
    }

    static getInventory(userID, inventoryID){
        return Inventory.findOne({ where: { id: inventoryID} })
        .then((inventory) => {
            if(inventory == null) { return {}; }
            return InvItem.findAll({
                where: { invID: inventory.id},
                order: [['name', 'ASC'],]
            }).then((invItems) => {
              return {
                Inventory : inventory,
                InvItems : invItems
              };
            });
        });
    }

    static async getAllSkills(userID, charID, skills=null, profDataArray=null, loreDataArray=null) {

        if(skills==null){
          skills = await Prisma.skills.findMany();
        }

        if(profDataArray==null){
          profDataArray = await CharDataMappingExt.getDataAllProficiencies(charID);
        }

        if(loreDataArray==null){
          loreDataArray = await CharDataMapping.getDataAll(charID, 'loreCategories', null);
        }


        let skillArray = [];

        for(const skill of skills){
            if(skill.name != "Lore"){
                skillArray.push({ SkillName : skill.name, Skill : skill });
            }
        }

        let loreSkill = skills.find(skill => {
            return skill.name === "Lore";
        });

        for(const loreData of loreDataArray) {
            if(loreData.value != null){
                skillArray.push({ SkillName : capitalizeWords(loreData.value)+" Lore", Skill : loreSkill });
            }
        }

        let skillMap = new Map();

        let tempCount = 0;
        for(const skillData of skillArray){
            let bestProf = 'U';
            let numUps = 0;
            for(const profData of profDataArray){
                tempCount++;

                if(profData.For == "Skill" && profData.To != null){
                    let tempSkillName = skillData.SkillName.toUpperCase();
                    tempSkillName = tempSkillName.replace(/_|\s+/g,"");
                    let tempProfTo = profData.To.toUpperCase();
                    tempProfTo = tempProfTo.replace(/_|\s+/g,"");
                    if(tempProfTo === tempSkillName) {
                        numUps += getUpAmt(profData.Prof);
                        bestProf = getBetterProf(bestProf, profData.Prof);
                    }
                }
            }

            skillMap.set(skillData.SkillName, {
                Name : skillData.SkillName,
                NumUps : profTypeToNumber(bestProf)+numUps,
                Skill : skillData.Skill
            });
        }

        //console.log("SkillMap: Did "+tempCount+" comparisons.");

        return mapToObj(skillMap);

    }

    static getAllAncestries(userID, enabledSources, enabledHomebrew, includeTag) {

        
            return Ancestry.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(enabledSources)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                    },
                    [Op.not]: [
                      { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
                    ]
                }
            })
            .then((ancestries) => {
                return Heritage.findAll({
                    where: {
                        contentSrc: {
                          [Op.or]: CharContentSources.getSourceArray(enabledSources)
                        },
                        homebrewID: {
                          [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                        },
                        [Op.not]: [
                          { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
                        ]
                    },
                    order: [['name', 'ASC'],]
                })
                .then((heritages) => {
                    return Language.findAll({
                      where: {
                          homebrewID: {
                            [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                          },
                      }
                    }).then((languages) => {
                        return AncestryLanguage.findAll({
                          where: {
                              homebrewID: {
                                [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                              },
                          }
                        }).then((ancestLangs) => {
                            return AncestryBoost.findAll({
                              where: {
                                  homebrewID: {
                                    [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                                  },
                              }
                            }).then((ancestBoosts) => {
                                return AncestryFlaw.findAll({
                                  where: {
                                      homebrewID: {
                                        [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                                      },
                                  }
                                }).then((ancestFlaws) => {
                                    return Tag.findAll({
                                      where: {
                                          homebrewID: {
                                            [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
                                          },
                                      }
                                    }).then((tags) => {
                                        return CharGathering.getAllSenses(userID)
                                        .then((senseTypes) => {
                                            return CharGathering.getAllPhysicalFeatures(userID)
                                            .then((physicalFeatures) => {
    
                                                let ancestryMap = new Map();
    
                                                for (const ancestry of ancestries) {
                                                    let tag = null;
                                                    if(includeTag){
                                                        tag = tags.find(tag => {
                                                            return tag.id === ancestry.tagID;
                                                        });
                                                    }
                                                    let visionSense, additionalSense = null;
                                                    for(let senseType of senseTypes){
                                                        if(senseType.id === ancestry.visionSenseID){
                                                            visionSense = senseType;
                                                        } else if(senseType.id === ancestry.additionalSenseID){
                                                            additionalSense = senseType;
                                                        }
                                                    }
                                                    let physicalFeatureOne, physicalFeatureTwo = null;
                                                    for(let physicalFeature of physicalFeatures){
                                                        if(physicalFeature.id === ancestry.physicalFeatureOneID){
                                                            physicalFeatureOne = physicalFeature;
                                                        } else if(physicalFeature.id === ancestry.physicalFeatureTwoID){
                                                            physicalFeatureTwo = physicalFeature;
                                                        }
                                                    }
                                                    ancestryMap.set(ancestry.id, {Ancestry : ancestry, Heritages : [],
                                                        Languages : [], BonusLanguages : [], Boosts : [], Flaws : [],
                                                        Tag : tag, VisionSense : visionSense, AdditionalSense : additionalSense,
                                                        PhysicalFeatureOne: physicalFeatureOne, PhysicalFeatureTwo: 
                                                        physicalFeatureTwo});
                                                }
    
                                                for (const heritage of heritages) {
    
                                                    let ancestryID = null;
                                                    if(heritage.ancestryID != null){
                                                        ancestryID = heritage.ancestryID;
                                                    } else if(heritage.indivAncestryName != null){
                                                        let ancestry = ancestries.find(ancestry => {
                                                            return ancestry.isArchived == 0 && ancestry.name === heritage.indivAncestryName;
                                                        });
                                                        if(ancestry != null){
                                                            ancestryID = ancestry.id;
                                                        }
                                                    }
                                                    let ancestryStruct = ancestryMap.get(ancestryID);
                                                    if(ancestryStruct != null){
                                                        ancestryStruct.Heritages.push(heritage);
                                                    }
    
                                                }
    
                                                for (const ancestLang of ancestLangs) {
    
                                                    if(ancestLang.isBonus === 1) {
    
                                                        let language = languages.find(language => {
                                                            return language.id === ancestLang.langID;
                                                        });
                                
                                                        let ancestryStruct = ancestryMap.get(ancestLang.ancestryID);
                                                        if(ancestryStruct != null){
                                                            ancestryStruct.BonusLanguages.push(language);
                                                        }
    
                                                    } else {
    
                                                        let language = languages.find(language => {
                                                            return language.id === ancestLang.langID;
                                                        });
                                
                                                        let ancestryStruct = ancestryMap.get(ancestLang.ancestryID);
                                                        if(ancestryStruct != null){
                                                            ancestryStruct.Languages.push(language);
                                                        }
    
                                                    }
    
                                                }
    
                                                for (const ancestBoost of ancestBoosts) {
    
                                                    let ancestryStruct = ancestryMap.get(ancestBoost.ancestryID);
                                                    if(ancestryStruct != null){
                                                        ancestryStruct.Boosts.push(ancestBoost.boostedAbility);
                                                    }
    
                                                }
    
                                                for (const ancestFlaw of ancestFlaws) {
    
                                                    let ancestryStruct = ancestryMap.get(ancestFlaw.ancestryID);
                                                    if(ancestryStruct != null){
                                                        ancestryStruct.Flaws.push(ancestFlaw.flawedAbility);
                                                    }
    
                                                }
    
                                                return mapToObj(ancestryMap);
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        
    }

    static getAllLanguages(userID, charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return AncestryLanguage.findAll({ where: { ancestryID: character.ancestryID} })
            .then((ancestLangs) => {
                return Language.findAll({
                  where: {
                      homebrewID: {
                        [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
                      },
                  }
                }).then((languages) => {

                    let langMap = new Map();

                    for(const lang of languages){
                        let bonusLangData = ancestLangs.find(ancestLang => {
                            if(ancestLang.langID === lang.id) {
                                return ancestLang.isBonus == 1;
                            }
                        });
                        let isBonus = (bonusLangData != null);
                        langMap.set(lang.id, {Lang : lang, IsBonus : isBonus});
                    }

                    return mapToObj(langMap);

                });
            });
        });
    }

    static async getAllCharConditions(userID, charID, charConditions=null) {

      if(charConditions==null) {
        Condition.hasMany(CharCondition, {foreignKey: 'conditionID'});
        CharCondition.belongsTo(Condition, {foreignKey: 'conditionID'});
        charConditions = await CharCondition.findAll({
          where: { charID: charID },
          include: [Condition],
        });
      }

      let conditionMap = new Map();

      for(const charCondition of charConditions){
        conditionMap.set(charCondition.conditionID, {
          Condition : charCondition.condition,
          EntryID : charCondition.id,
          Value : charCondition.value,
          SourceText : charCondition.sourceText,
          ParentID : charCondition.parentID,
        });
      }

      return mapToObj(conditionMap);

    }

    static async getAllAncestriesBasic(userID, enabledSources, enabledHomebrew) {
      return await Prisma.ancestries.findMany({
        where: {
          AND: [
            {OR: CharContentSources.getSourceArrayPrisma(enabledSources)},
            {OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)},
            {NOT: TempUnpublishedBooks.getSourcesArrayPrisma(userID)}
          ],
        }
      });
    }

    static async getAllBackgrounds(userID, enabledSources, enabledHomebrew) {
      return await Prisma.backgrounds.findMany({
        where: {
          AND: [
            {OR: CharContentSources.getSourceArrayPrisma(enabledSources)},
            {OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)},
            {NOT: TempUnpublishedBooks.getSourcesArrayPrisma(userID)}
          ],
        }
      });
    }

    static async getAllUnselectedData(userID, charID){
      return await CharDataMapping.getDataAll(charID,"unselectedData",null);
    }

    static async getAllPhysicalFeatures(userID) {
      return await Prisma.physicalFeatures.findMany();
    }

    static async getAllSenses(userID) {
      return await Prisma.senseTypes.findMany();
    }

    static async getAllDomains(userID, enabledSources, enabledHomebrew) {
      return await Prisma.domains.findMany({
        where: {
          AND: [
            {OR: CharContentSources.getSourceArrayPrisma(enabledSources)},
            {OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)},
            {NOT: TempUnpublishedBooks.getSourcesArrayPrisma(userID)}
          ],
        },
        orderBy: [{ name: 'asc' }],
      });
    }

    static async getAllTags(userID, enabledHomebrew) {
      return await Prisma.tags.findMany({
        where: {
          OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew),
        },
        orderBy: [{ name: 'asc' }],
      });
    }

    static async getResistancesAndVulnerabilities(userID, charID, resistancesDataArray=null, vulnerabilitiesDataArray=null) {

      if(resistancesDataArray==null){
        resistancesDataArray = await CharDataMappingExt.getDataAllResistance(charID);
      }

      if(vulnerabilitiesDataArray==null){
        vulnerabilitiesDataArray = await CharDataMappingExt.getDataAllVulnerability(charID);
      }

      return {Resistances: resistancesDataArray, Vulnerabilities: vulnerabilitiesDataArray};

    }

    static async getNoteFields(userID, charID) {

      let notesDataArray = await CharDataMapping.getDataAll(charID, 'notesField', null);

      let noteFields = await NoteField.findAll({ where: { charID: charID } });

      for(let notesData of notesDataArray){
        let noteFieldID = srcStructToCode(charID, 'notesField', notesData);
        let noteField = noteFields.find(noteField => {
          return noteField.id == noteFieldID;
        });
        if(noteField != null){
          notesData.text = noteField.text;
          notesData.placeholderText = noteField.placeholderText;
        }
      }

      return notesDataArray;

    }

    static getNoteField(userID, charID, notesData) {
        let noteFieldID = srcStructToCode(charID, 'notesField', notesData);
        return NoteField.findOne({ where: { id: noteFieldID, charID: charID } })
        .then((noteField) => {
            if(noteField != null){
                notesData.text = noteField.text;
                notesData.placeholderText = noteField.placeholderText;
            }
            return notesData;
        });
    }

    static async getOtherSpeeds(userID, charID) {
      return await CharDataMappingExt.getDataAllOtherSpeed(charID);
    }

    // Weapon, Armor, and Critical Specializations
    static async getSpecializations(userID, charID, weapSpecialsDataArray=null, weapCriticalsDataArray=null, armorSpecialDataArray=null) {

      if(weapSpecialsDataArray==null){
        weapSpecialsDataArray = await CharDataMapping.getDataAll(charID, 'weaponSpecialization', null);
      }

      if(weapCriticalsDataArray==null){
        weapCriticalsDataArray = await CharDataMapping.getDataAll(charID, 'weaponCriticalSpecialization', null);
      }

      if(armorSpecialDataArray==null){
        armorSpecialDataArray = await CharDataMapping.getDataAll(charID, 'armorSpecialization', null);
      }

      let hasWeapSpecial = false;
      let hasWeapSpecialGreater = false;
      for(const specialsData of weapSpecialsDataArray){
        if(specialsData.value == 1){
          hasWeapSpecial = true;
        } else if(specialsData.value == 2){
          hasWeapSpecialGreater = true;
        }
      }

      return {
        WeaponSpecial: hasWeapSpecial,
        GreaterWeaponSpecial: hasWeapSpecialGreater,
        WeapCriticals: weapCriticalsDataArray,
        ArmorSpecial: armorSpecialDataArray,
      };

    }

    static async getWeaponFamiliarities(userID, charID) {
      return await CharDataMapping.getDataAll(charID, 'weaponFamiliarity', null);
    }


    static async getSpellData(userID, charID){

      // Normal Spells //
      let spellSlotsMap = await CharSpells.getSpellSlotMap(charID);

      let spellBookSlotPromises = [];
      for(const [spellSRC, spellSlotArray] of spellSlotsMap.entries()){
        let newPromise = CharSpells.getSpellBook(charID, spellSRC, false);
        spellBookSlotPromises.push(newPromise);
      }
      let spellBookSlotArray = await Promise.all(spellBookSlotPromises);


      // Focus Spells //
      let focusSpellMap = await CharSpells.getFocusSpells(charID);

      let spellBookFocusPromises = [];
      for(const [spellSRC, focusSpellDataArray] of focusSpellMap.entries()){
        let newPromise = CharSpells.getSpellBook(charID, spellSRC, true);
        spellBookFocusPromises.push(newPromise);
      }
      let spellBookFocusArray = await Promise.all(spellBookFocusPromises);


      // Combine Normal Spells with Focus Spells
      let spellBookArray = spellBookSlotArray
              .concat(spellBookFocusArray.filter((entry) => spellBookSlotArray.indexOf(entry) < 0));


      // Innate Spells //
      let innateSpellArray = await CharDataMappingExt.getDataAllInnateSpell(charID);

      let innateSpellPromises = [];
      for(const innateSpell of innateSpellArray){
        let innateSpellCastingsID = getInnateSpellCastingID(innateSpell);
        let newPromise = InnateSpellCasting.findOrCreate({where: {innateSpellID: innateSpellCastingsID}, defaults: {timesCast: 0}, raw: true});
        innateSpellPromises.push(newPromise);
      }

      let innateSpellCastings = await Promise.all(innateSpellPromises);

      for(let innateSpell of innateSpellArray){
        let innateSpellCastingsID = getInnateSpellCastingID(innateSpell);
        let innateSpellData = innateSpellCastings.find(innateSpellData => {
            return innateSpellData[0].innateSpellID === innateSpellCastingsID;
        });
        innateSpell.TimesCast = innateSpellData[0].timesCast;
        innateSpell.TimesPerDay = parseInt(innateSpell.TimesPerDay);
        innateSpell.SpellLevel = parseInt(innateSpell.SpellLevel);
      }
    
      // Focus Points //
      let focusPointsDataArray = await CharSpells.getFocusPoints(charID);


      return {
        SpellSlotObject: mapToObj(spellSlotsMap),
        SpellBookArray: spellBookArray,
        InnateSpellArray: innateSpellArray,
        FocusSpellObject: mapToObj(focusSpellMap),
        FocusPointsArray: focusPointsDataArray,
      };

    }

    static getChoicesAbilityBonus(userID, charID) {
        return CharDataMappingExt.getDataAllAbilityBonus(charID)
        .then((bonusDataArray) => {
            return bonusDataArray;
        });
    }

    static getChoicesFeats(userID, charID) {
        return CharDataMapping.getDataAll(charID, 'chosenFeats', Feat)
        .then((featDataArray) => {
            return featDataArray;
        });
    }

    static getChoicesDomains(userID, charID) {
        return CharDataMapping.getDataAll(charID, 'domains', Domain)
        .then((domainDataArray) => {
            return domainDataArray;
        });
    }


    static async getAllLanguagesBasic(userID, enabledHomebrew) {
      return await Prisma.languages.findMany({
        where: {
          OR: CharContentHomebrew.getHomebrewArrayPrisma(enabledHomebrew)
        }
      });
    }

    static async getAllConditions(userID){
      return await Prisma.conditions.findMany();
    }


    static async getAncestry(userID, charID, character=null) {
      if(character==null){
        character = await CharGathering.getCharacter(userID, charID);
      }
      if(character.ancestryID != null){
        return await Prisma.ancestries.findUnique({ where: { id: character.ancestryID } });
      } else {
        return Promise.resolve();
      }
    }

    static async getBackground(userID, charID, character=null) {
      if(character==null){
        character = await CharGathering.getCharacter(userID, charID);
      }
      if(character.backgroundID != null){
        return await Prisma.backgrounds.findUnique({ where: { id: character.backgroundID } });
      } else {
        return Promise.resolve();
      }
    }

    static async getHeritage(userID, charID, character=null) {
      if(character==null){
        character = await CharGathering.getCharacter(userID, charID);
      }
      if(character.heritageID != null){
        return await Prisma.heritages.findUnique({ where: { id: character.heritageID } });
      } else if (character.uniHeritageID != null) {
        return await Prisma.uniHeritages.findUnique({ where: { id: character.uniHeritageID } });
      } else {
        return Promise.resolve();
      }
    }

    static getClassBasic(userID, character) {
      return Class.findOne({
        where: {
          id: character.classID,
        } 
      }).then((cClass) => {
          return cClass;
      });
    }

    static async getClass(userID, charID, classID, enabledSources, enabledHomebrew) {

      let cClass = await Prisma.classes.findUnique({ where: { id: parseInt(classID) } });

      let keyBoostData = null;
      if(charID != null){
        const srcStruct = {
          sourceType: 'class',
          sourceLevel: 1,
          sourceCode: 'keyAbility',
          sourceCodeSNum: 'a',
        };
        keyBoostData = await CharDataMappingExt.getDataSingleAbilityBonus(charID, srcStruct);
      }

      let keyAbility = null;
      if(keyBoostData != null) { keyAbility = keyBoostData.Ability; }

      if(cClass != null){

        const classAbilities = await ClassAbility.findAll({
          order: [['level', 'ASC'],['name', 'ASC'],],
          where: {
              contentSrc: {
                [Op.or]: CharContentSources.getSourceArray(enabledSources)
              },
              homebrewID: {
                [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
              },
              [Op.not]: [
                { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
              ],
              [Op.or]: [
                  { classID: cClass.id },
                  { indivClassName: cClass.name }
              ],
          },
          raw: true,
        });

        return {Class : cClass, Abilities : classAbilities, KeyAbility : keyAbility};

      } else {

        return {Class : null, Abilities: null, KeyAbility : null};

      }

    }

    static async getCharacter(userID, charID) {
      console.log('( FINDING CHARACTER )');
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return character;
      });
    }

    static getAllAbilityTypes(userID) {
        return ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
    }

    static getAncestryLanguages(userID, ancestryID){
        return AncestryLanguage.findAll({ where: { ancestryID: ancestryID } })
        .then((ancestLangs) => {
            return ancestLangs;
        });
    }

    static getLanguageByName(userID, charID, langName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Language.findOne({
          where: {
            name: langName,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
            },
          }
        }).then((language) => {
          return language;
        });
      });
    }

    static getFeatByName(userID, charID, featName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Feat.findOne({
          where: {
            name: featName,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
            },
          }
        }).then((feat) => {
            return feat;
        });
      });
    }

    static getSpellByName(userID, charID, spellName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Spell.findOne({
          where: {
            name: spellName,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
            },
          }
        }).then((spell) => {
            return spell;
        });
      });
    }

    static getSenseTypeByName(userID, charID, senseTypeName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return SenseType.findOne({
          where: {
            name: senseTypeName,
          }
        }).then((senseType) => {
            return senseType;
        });
      });
    }

    static getPhyFeatByName(userID, charID, phyFeatName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return PhysicalFeature.findOne({
          where: {
            name: phyFeatName,
          }
        }).then((phyFeat) => {
            return phyFeat;
        });
      });
    }

    static getClassFeatureByName(userID, charID, featureName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return ClassAbility.findOne({
          where: {
            name: featureName,
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(character.enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
          }
        })
        .then((classFeature) => {
          return classFeature;
        });
      });
    }

    static getHeritageByName(userID, charID, heritageName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Heritage.findOne({
          where: {
            name: heritageName,
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(character.enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
          }
        })
        .then((heritage) => {
          return heritage;
        });
      });
    }

    static getHeritagesByAncestryName(userID, charID, ancestryName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Ancestry.findOne({
          where: {
            name: ancestryName,
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(character.enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
          } 
        }).then((ancestry) => {
          if(ancestry == null) {return null;}
          return Heritage.findAll({
            where: {
              [Op.or]: [
                { ancestryID: ancestry.id },
                { indivAncestryName: ancestry.name }
              ],
              contentSrc: {
                [Op.or]: CharContentSources.getSourceArray(character.enabledSources)
              },
              homebrewID: {
                [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
              },
              [Op.not]: [
                { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
              ]
            }
          }).then((heritages) => {
            return heritages;
          });
        });
      });
    }

    static getItem(userID, charID, itemID) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Item.findOne({
          where: {
            id: itemID,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character.enabledHomebrew)
            },
          }
        }).then((item) => {
            return item;
        });
      });
    }

    static getAllAnimalCompanions(userID, enabledSources, enabledHomebrew) {
      return AnimalCompanion.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
        }
      })
      .then((animalCompanions) => {
          return animalCompanions;
      });
    }

    static getAllSpecificFamiliars(userID, enabledSources, enabledHomebrew) {
      return SpecificFamiliar.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
        }
      })
      .then((specificFamiliars) => {
          return specificFamiliars;
      });
    }

    static getAllFamiliarAbilities(userID, enabledSources, enabledHomebrew) {
      return FamiliarAbility.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(enabledSources)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
            },
            [Op.not]: [
              { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
            ]
        }
      })
      .then((familiarAbilities) => {
          return familiarAbilities;
      });
    }

    static getCharAnimalCompanions(userID, charID) {
      return CharAnimalCompanion.findAll({ where: { charID: charID} })
      .then((charAnimalComps) => {
        return charAnimalComps;
      });
    }

    static getCharFamiliars(userID, charID) {
      return CharFamiliar.findAll({ where: { charID: charID} })
      .then((charFamiliars) => {
        return charFamiliars;
      });
    }

    static async getCompanionData(userID, charID, enabledSources, enabledHomebrew){

      let allAnimalCompanions = await CharGathering.getAllAnimalCompanions(userID, enabledSources, enabledHomebrew);

      let charAnimalComps = await CharGathering.getCharAnimalCompanions(userID, charID);
      
      let allSpecificFamiliars = await CharGathering.getAllSpecificFamiliars(userID, enabledSources, enabledHomebrew);
      
      let allFamiliarAbilities = await CharGathering.getAllFamiliarAbilities(userID, enabledSources, enabledHomebrew);
      
      let charFamiliars = await CharGathering.getCharFamiliars(userID, charID);
      

      return {
        AllAnimalCompanions : allAnimalCompanions,
        AnimalCompanions : charAnimalComps,
        AllSpecificFamiliars : allSpecificFamiliars,
        AllFamiliarAbilities : allFamiliarAbilities,
        Familiars : charFamiliars,
      };

    }

    static async getAbilityScores(userID, charID, charAbilityScores=null, bonusDataArray=null) {

        if(charAbilityScores==null){
          charAbilityScores = await CharGathering.getBaseAbilityScores(userID, charID);
        }

        if(bonusDataArray==null){
          bonusDataArray = await CharDataMappingExt.getDataAllAbilityBonus(charID);
        }

  
        let abilMap = new Map();
        abilMap.set("STR", charAbilityScores.STR);
        abilMap.set("DEX", charAbilityScores.DEX);
        abilMap.set("CON", charAbilityScores.CON);
        abilMap.set("INT", charAbilityScores.INT);
        abilMap.set("WIS", charAbilityScores.WIS);
        abilMap.set("CHA", charAbilityScores.CHA);

        let boostMap = new Map();
        for(const bonusData of bonusDataArray){
            if(bonusData.Bonus == "Boost") {
                let boostNums = boostMap.get(bonusData.Ability);
                if(boostNums == null){
                    boostMap.set(bonusData.Ability, 1);
                } else {
                    boostMap.set(bonusData.Ability, boostNums+1);
                }
            } else if(bonusData.Bonus == "Flaw") {
                let boostNums = boostMap.get(bonusData.Ability);
                if(boostNums == null){
                    boostMap.set(bonusData.Ability, -1);
                } else {
                    boostMap.set(bonusData.Ability, boostNums-1);
                }
            } else {
                let abilBonus = abilMap.get(bonusData.Ability);
                abilMap.set(bonusData.Ability, abilBonus+parseInt(bonusData.Bonus));
            }
        }

        for(const [ability, boostNums] of boostMap.entries()){
            let abilityScore = abilMap.get(ability);
            for (let i = 0; i < boostNums; i++) {
                if(abilityScore < 18){
                    abilityScore += 2;
                } else {
                    abilityScore += 1;
                }
            }
            if(boostNums < 0) {
                abilityScore = abilityScore+boostNums*2;
            }
            abilMap.set(ability, abilityScore);
        }

        return mapToObj(abilMap);

    }

    

    static getProfs(userID, charID) {
        return CharDataMappingExt.getDataAllProficiencies(charID)
        .then((profDataArray) => {

            let profMap = new Map();
            for(const profData of profDataArray){

              // Convert lores to be the same
              if(profData.To.includes('_LORE')){
                profData.To = capitalizeWords(profData.To.replace('_LORE',' Lore'));
              }

              let profMapValue = profMap.get(profData.To);
              if(profMapValue != null){
                profMapValue.push(profData);
                profMap.set(profData.To, profMapValue);
              } else {
                profMap.set(profData.To, [profData]);
              }
            }

            return profMap;
        });
    }

    static getFinalProfs(userID, charID){
      return CharGathering.getProfs(userID, charID)
      .then((profMap) => {

        let finalProfMap = new Map();

        for(const [profName, dataArray] of profMap.entries()){

          let increaseNumUps = 0;
          let highestNumUps = 0;

          for(let srcData of dataArray){
            if(srcData.Prof == 'UP' || srcData.Prof == 'DOWN'){
              increaseNumUps += getUpAmt(srcData.Prof);
            } else {
              let currentNumUps = profTypeToNumber(srcData.Prof);
              if(currentNumUps > highestNumUps){
                highestNumUps = currentNumUps;
              }
            }
          }

          finalProfMap.set(profName, profTypeFromNumber(highestNumUps+increaseNumUps));

        }

        return finalProfMap;

      });
    }

    
    static async getSheetStates(userID, enabledSources, enabledHomebrew) {

      return SheetState.findAll({
        order: [['name', 'ASC'],],
        where: {
          contentSrc: {
            [Op.or]: CharContentSources.getSourceArray(enabledSources)
          },
          homebrewID: {
            [Op.or]: CharContentHomebrew.getHomebrewArray(enabledHomebrew)
          },
          [Op.not]: [
            { contentSrc: { [Op.or]: TempUnpublishedBooks.getSourcesArray(userID) } },
          ]
        }
      });

    }

    static getClassArchetypeID(userID, charID) {
      
        let srcStruct = {
            sourceType: 'class',
            sourceLevel: 1,
            sourceCode: 'classArchetype',
            sourceCodeSNum: 'a',
        };
        return CharDataMapping.getDataSingle(charID, 'classArchetypeChoice', srcStruct)
        .then((data) => {
          return (data != null) ? data.value : null;
        });

    }

    static getBaseAbilityScores(userID, charID) {

        let srcStruct = {
            sourceType: 'other',
            sourceLevel: 1,
            sourceCode: 'none',
            sourceCodeSNum: 'a',
        };
        return CharDataMappingExt.getDataSingleAbilityBonus(charID, srcStruct)
        .then((bonusData) => {
            let charAbilityScores = null;
            if(bonusData != null) {
                let bonusArray = JSON.parse(bonusData.Bonus);
                charAbilityScores = {
                    STR : 10 + parseInt(bonusArray[0]),
                    DEX : 10 + parseInt(bonusArray[1]),
                    CON : 10 + parseInt(bonusArray[2]),
                    INT : 10 + parseInt(bonusArray[3]),
                    WIS : 10 + parseInt(bonusArray[4]),
                    CHA : 10 + parseInt(bonusArray[5]),
                };
            } else {
                charAbilityScores = {
                    STR : 10,
                    DEX : 10,
                    CON : 10,
                    INT : 10,
                    WIS : 10,
                    CHA : 10,
                };
            }   
            return charAbilityScores;
        });

    }


};
