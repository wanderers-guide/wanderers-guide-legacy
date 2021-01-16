
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
const InvItemRune = require('../models/contentDB/InvItemRune');
const Weapon = require('../models/contentDB/Weapon');
const DamageType = require('../models/contentDB/DamageType');
const TaggedItem = require('../models/contentDB/TaggedItem');
const Armor = require('../models/contentDB/Armor');
const Storage = require('../models/contentDB/Storage');
const Shield = require('../models/contentDB/Shield');
const ItemRune = require('../models/contentDB/ItemRune');
const AnimalCompanion = require('../models/contentDB/AnimalCompanion');
const CharAnimalCompanion = require('../models/contentDB/CharAnimalCompanion');
const SpecificFamiliar = require('../models/contentDB/SpecificFamiliar');
const FamiliarAbility = require('../models/contentDB/FamiliarAbility');
const CharFamiliar = require('../models/contentDB/CharFamiliar');
const CharDataMappingModel = require('../models/contentDB/CharDataMapping');
const CalculatedStat = require('../models/contentDB/CalculatedStat');

const CharDataMapping = require('./CharDataMapping');
const CharDataMappingExt = require('./CharDataMappingExt');

const CharContentSources = require('./CharContentSources');
const CharContentHomebrew = require('./CharContentHomebrew');

const CharSpells = require('./CharSpells');
const CharTags = require('./CharTags');

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

function getUserBonus(profBonus){
    let numBonus = parseInt(profBonus);
    return (isNaN(numBonus) ? 0 : numBonus);
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

    static getAllMetadata(charID){
      return CharDataMappingModel.findAll({ where: { charID: charID } })
      .then((charMetaDatas) => {
        return charMetaDatas;
      });
    }

    static getCalculatedStats(charID){
      return CalculatedStat.findOne({ where: { charID: charID } })
      .then((calculatedStats) => {
        return calculatedStats;
      });
    }

    static getAllClasses(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Class.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                }
            }).then((classes) => {
                return ClassAbility.findAll({
                    order: [['level', 'ASC'],['name', 'ASC'],],
                    where: {
                        contentSrc: {
                          [Op.or]: CharContentSources.getSourceArray(character)
                        },
                        homebrewID: {
                          [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                        },
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
        });
    }

    static getAllClassFeatureOptions(charID) {
      return Character.findOne({ where: { id: charID} })
      .then((character) => {
        return ClassAbility.findAll({
          order: [['level', 'ASC'],['name', 'ASC'],],
          where: {
              selectType: 'SELECT_OPTION',
              contentSrc: {
                [Op.or]: CharContentSources.getSourceArray(character)
              },
              homebrewID: {
                [Op.or]: CharContentHomebrew.getHomebrewArray(character)
              },
          }
        })
        .then((allClassFeatureOptions) => {
          return allClassFeatureOptions;
        });
      });
    }

    static getAllExtraClassFeatures(charID){
      return CharDataMapping.getDataAll(charID, 'classAbilityExtra', ClassAbility)
      .then((extraClassFeaturesArray) => {
        return extraClassFeaturesArray;
      });
    }

    static getAllArchetypes(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Archetype.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                }
            })
            .then((archetypes) => {
                return archetypes;
            });
        });
    }

    static getAllUniHeritages(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return UniHeritage.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                },
                order: [['name', 'ASC'],]
            })
            .then((uniHeritages) => {
                return uniHeritages;
            });
        });
    }

    static getAllFeats(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Feat.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                }
            })
            .then((feats) => {
                return FeatTag.findAll()
                .then((featTags) => {
                    return Tag.findAll({
                      where: {
                          homebrewID: {
                            [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                          },
                      }
                    }).then((tags) => {
        
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
                            featMap.set(feat.id, {Feat : feat, Tags : fTags});
                        }

                        for (const featTag of featTags) {

                            let tag = tags.find(tag => {
                                return tag.id === featTag.tagID;
                            });

                            let featStruct = featMap.get(featTag.featID);
                            if(featStruct != null){
                                featStruct.Tags.push(tag);
                            }

                        }

                        return mapToObj(featMap);
        
                    });
                });
            });
        });
    }

    static getAllSpells(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Spell.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                },
                order: [['level', 'ASC'],['name', 'ASC'],]
            })
            .then((spells) => {
                return TaggedSpell.findAll()
                .then((taggedSpells) => {
                    return Tag.findAll({
                      where: {
                          homebrewID: {
                            [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                          },
                      }
                    }).then((tags) => {
        
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
        
                    });
                });
            });
        });
    }

    static getAllItems(charID){

        console.log('~~~~~~~~~~~ REQUESTING ALL ITEMS ~~~~~~~~~~~');

        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Item.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                }
            })
            .then((items) => {
                return Tag.findAll({
                  where: {
                      homebrewID: {
                        [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                      },
                  }
                }).then((tags) => {
                    return TaggedItem.findAll()
                    .then((taggedItems) => {
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
                                                    
                                            let itemMap = new Map();

                                            for(const item of items){

                                                let tagArray = [];
                                                for(const taggedItem of taggedItems){
                                                    if(taggedItem.itemID == item.id) {

                                                        let tag = tags.find(tag => {
                                                            return tag.id == taggedItem.tagID;
                                                        });
                
                                                        tagArray.push({
                                                            Tag : tag
                                                        });

                                                    }
                                                }

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

    static getInvIDFromInvItemID(invItemID){
      return InvItem.findOne({ where: { id: invItemID } })
      .then((invItem) => {
        if(invItem != null){
          return invItem.invID;
        } else {
          return null;
        }
      });
    }

    static getInventory(inventoryID){
        return Inventory.findOne({ where: { id: inventoryID} })
        .then((inventory) => {
            return InvItem.findAll({
                where: { invID: inventory.id},
                order: [['name', 'ASC'],]
            }).then((invItems) => {
                return InvItemRune.findAll()
                .then((invItemRunes) => {

                    for(let invItem of invItems){
                        let invItemRune = invItemRunes.find(invItemRune => {
                            return invItemRune.invItemID == invItem.id;
                        });
                        if(invItemRune != null){
                            invItem.itemRuneData = {
                                id : invItemRune.id,
                                invItemID : invItemRune.invItemID,
                                fundRuneID : invItemRune.fundRuneID,
                                fundPotencyRuneID : invItemRune.fundPotencyRuneID,
                                propRune1ID : invItemRune.propRune1ID,
                                propRune2ID : invItemRune.propRune2ID,
                                propRune3ID : invItemRune.propRune3ID,
                                propRune4ID : invItemRune.propRune4ID
                            };
                        } else {
                            invItem.itemRuneData = null;
                        }
                    }

                    return {
                        Inventory : inventory,
                        InvItems : invItems
                    };
                });

            });
        });
    }

    static getAllSkills(charID) {

        console.log('~~~~~~~~~~~ REQUESTING ALL SKILLS ~~~~~~~~~~~');

        return Skill.findAll()
        .then((skills) => {
            return CharDataMappingExt.getDataAllProficiencies(charID)
            .then((profDataArray) => {
                return CharDataMapping.getDataAll(charID, 'loreCategories', null)
                .then((loreDataArray) => {
                    
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

                    console.log("SkillMap: Did "+tempCount+" comparisons.");

                    return mapToObj(skillMap);

                });
            });
        });
    }

    static getAllAncestries(charID, includeTag) {

        console.log('~~~~~~~~~~~ REQUESTING ALL ANCESTRIES ~~~~~~~~~~~');

        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Ancestry.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                }
            })
            .then((ancestries) => {
                return Heritage.findAll({
                    where: {
                        contentSrc: {
                          [Op.or]: CharContentSources.getSourceArray(character)
                        },
                        homebrewID: {
                          [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                        },
                    },
                    order: [['name', 'ASC'],]
                })
                .then((heritages) => {
                    return Language.findAll({
                      where: {
                          homebrewID: {
                            [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                          },
                      }
                    }).then((languages) => {
                        return AncestryLanguage.findAll({
                          where: {
                              homebrewID: {
                                [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                              },
                          }
                        }).then((ancestLangs) => {
                            return AncestryBoost.findAll({
                              where: {
                                  homebrewID: {
                                    [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                                  },
                              }
                            }).then((ancestBoosts) => {
                                return AncestryFlaw.findAll({
                                  where: {
                                      homebrewID: {
                                        [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                                      },
                                  }
                                }).then((ancestFlaws) => {
                                    return Tag.findAll({
                                      where: {
                                          homebrewID: {
                                            [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                                          },
                                      }
                                    }).then((tags) => {
                                        return SenseType.findAll()
                                        .then((senseTypes) => {
                                            return CharGathering.getAllPhysicalFeatures()
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
        });
    }

    static getAllLanguages(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return AncestryLanguage.findAll({ where: { ancestryID: character.ancestryID} })
            .then((ancestLangs) => {
                return Language.findAll({
                  where: {
                      homebrewID: {
                        [Op.or]: CharContentHomebrew.getHomebrewArray(character)
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

    static getAllCharConditions(charID) {
        return Condition.findAll()
        .then((conditions) => {
            return CharCondition.findAll({ where: { charID: charID} })
            .then((charConditions) => {

                let conditionMap = new Map();

                for(const charCondition of charConditions){
                    let condition = conditions.find(condition => {
                        return charCondition.conditionID === condition.id;
                    });
                    conditionMap.set(charCondition.conditionID, {
                        Condition : condition,
                        EntryID : charCondition.id,
                        Value : charCondition.value,
                        SourceText : charCondition.sourceText,
                        ParentID : charCondition.parentID,
                    });
                }

                return mapToObj(conditionMap);

            });
        });
    }

    static getAllAncestriesBasic(character) {
      return Ancestry.findAll({
        where: {
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(character)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character)
            },
        }
      }).then((ancestries) => {
          return ancestries;
      });
    }

    static getAllBackgrounds(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Background.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                }
            })
            .then((backgrounds) => {
                return backgrounds;
            });
        });
    }

    static getAllPhysicalFeatures() {
        return PhysicalFeature.findAll()
        .then((physicalFeatures) => {
            return physicalFeatures;
        });
    }

    static getAllDomains(character) {
        return Domain.findAll({
          where: {
              contentSrc: {
                [Op.or]: CharContentSources.getSourceArray(character)
              },
              homebrewID: {
                [Op.or]: CharContentHomebrew.getHomebrewArray(character)
              },
          }
        }).then((domains) => {
            return domains;
        });
    }

    static getAllTags(charID) {
      return Character.findOne({ where: { id: charID} })
      .then((character) => {
        return Tag.findAll({
          raw: true,
          order: [['name', 'ASC'],],
          where: {
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character)
            },
          }
        }).then((tags) => {
            return tags;
        });
      });
    }

    static getResistancesAndVulnerabilities(charID) {
        return CharDataMappingExt.getDataAllResistance(charID)
        .then((resistancesDataArray) => {
            return CharDataMappingExt.getDataAllVulnerability(charID)
            .then((vulnerabilitiesDataArray) => {
                return {Resistances: resistancesDataArray, Vulnerabilities: vulnerabilitiesDataArray};
            });
        });
    }

    static getNoteFields(charID) {
        return CharDataMapping.getDataAll(charID, 'notesField', null)
        .then((notesDataArray) => {
            return NoteField.findAll({ where: { charID: charID } })
            .then(function(noteFields) {

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

            });
        });
    }

    static getNoteField(charID, notesData) {
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

    static getOtherSpeeds(charID) {
        return CharDataMappingExt.getDataAllOtherSpeed(charID)
        .then((speedsDataArray) => {
            return speedsDataArray;
        });
    } 

    // Weapon, Armor, and Critical Specializations
    static getSpecializations(charID) {
        return CharDataMapping.getDataAll(charID, 'weaponSpecialization', null)
        .then((specialsDataArray) => {

            let hasWeapSpecial = false;
            let hasWeapSpecialGreater = false;
            for(const specialsData of specialsDataArray){
                if(specialsData.value == 1){
                    hasWeapSpecial = true;
                } else if(specialsData.value == 2){
                    hasWeapSpecialGreater = true;
                }
            }

            return CharDataMapping.getDataAll(charID, 'weaponCriticalSpecialization', null)
            .then((weapCriticalsDataArray) => {
                return CharDataMapping.getDataAll(charID, 'armorSpecialization', null)
                .then((armorSpecialDataArray) => {

                    return {
                        WeaponSpecial: hasWeapSpecial,
                        GreaterWeaponSpecial: hasWeapSpecialGreater,
                        WeapCriticals: weapCriticalsDataArray,
                        ArmorSpecial: armorSpecialDataArray,
                    };

                });
            });
        });
    }

    static getWeaponFamiliarities(charID) {
        return CharDataMapping.getDataAll(charID, 'weaponFamiliarity', null)
        .then((familiaritiesDataArray) => {
            return familiaritiesDataArray;
        });
    }


    static getSpellData(charID){

        console.log('~~~~~~~~~~~ REQUESTING SPELL DATA ~~~~~~~~~~~');

        return CharSpells.getSpellSlotMap(charID)
        .then((spellSlotsMap) => {

            let spellBookSlotPromises = [];
            for(const [spellSRC, spellSlotArray] of spellSlotsMap.entries()){
                let newPromise = CharSpells.getSpellBook(charID, spellSRC, false);
                spellBookSlotPromises.push(newPromise);
            }
            return Promise.all(spellBookSlotPromises)
            .then(function(spellBookSlotArray) {

                return CharSpells.getFocusPoints(charID)
                .then((focusPointsDataArray) => {
                    return CharSpells.getFocusSpells(charID)
                    .then((focusSpellMap) => {
                        let spellBookFocusPromises = [];
                        for(const [spellSRC, focusSpellDataArray] of focusSpellMap.entries()){
                            let newPromise = CharSpells.getSpellBook(charID, spellSRC, true);
                            spellBookFocusPromises.push(newPromise);
                        }
                        return Promise.all(spellBookFocusPromises)
                        .then(function(spellBookFocusArray) {
                            let spellBookArray = spellBookSlotArray
                                .concat(spellBookFocusArray.filter((entry) => spellBookSlotArray.indexOf(entry) < 0));

                            return CharDataMappingExt.getDataAllInnateSpell(charID)
                            .then((innateSpellArray) => {
                                let innateSpellPromises = [];
                                for(const innateSpell of innateSpellArray){
                                    let innateSpellCastingsID = getInnateSpellCastingID(innateSpell);
                                    let newPromise = InnateSpellCasting.findOrCreate({where: {innateSpellID: innateSpellCastingsID}, defaults: {timesCast: 0}, raw: true});
                                    innateSpellPromises.push(newPromise);
                                }

                                return Promise.all(innateSpellPromises)
                                .then(function(innateSpellCastings) {
                                    for(let innateSpell of innateSpellArray){
                                        let innateSpellCastingsID = getInnateSpellCastingID(innateSpell);
                                        let innateSpellData = innateSpellCastings.find(innateSpellData => {
                                            return innateSpellData[0].innateSpellID === innateSpellCastingsID;
                                        });
                                        innateSpell.TimesCast = innateSpellData[0].timesCast;
                                        innateSpell.TimesPerDay = parseInt(innateSpell.TimesPerDay);
                                        innateSpell.SpellLevel = parseInt(innateSpell.SpellLevel);
                                    }
                                    return {
                                        SpellSlotObject: mapToObj(spellSlotsMap),
                                        SpellBookArray: spellBookArray,
                                        InnateSpellArray: innateSpellArray,
                                        FocusSpellObject: mapToObj(focusSpellMap),
                                        FocusPointsArray: focusPointsDataArray,
                                    };
                                });
                            });
                        });
                    });
                });
            });
        });
    }
    

    static getCharChoices(charID) {
      console.log("~~~~~~~~~~~ REQUESTING CHAR CHOICES ~~~~~~~~~~~");
  
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return CharGathering.getBackground(character)
        .then((background) => {
          return CharGathering.getAncestry(character)
          .then((ancestry) => {
            return CharGathering.getHeritage(character)
            .then((heritage) => {
              return CharGathering.getAllAncestriesBasic(character)
              .then((ancestries) => {
                return CharTags.getTags(charID)
                .then((charTagsArray) => {
                  return CharGathering.getClass(charID, character.classID)
                  .then((classDetails) => {
                    return CharGathering.getChoicesFeats(charID)
                    .then((featDataArray) => {
                      return CharGathering.getChoicesAbilityBonus(charID)
                      .then((bonusDataArray) => {
                        return CharDataMappingExt.getDataAllClassChoice(charID)
                        .then((choiceDataArray) => {
                          return CharDataMappingExt.getDataAllProficiencies(charID)
                          .then((profDataArray) => {
                            return CharDataMappingExt.getDataAllInnateSpell(charID)
                            .then((innateSpellDataArray) => {
                              return CharDataMapping.getDataAll(charID,"languages",Language)
                              .then((langDataArray) => {
                                return CharDataMapping.getDataAll(charID,"senses",SenseType)
                                .then((senseDataArray) => {
                                  return CharDataMapping.getDataAll(charID,"phyFeats",PhysicalFeature)
                                  .then((phyFeatDataArray) => {
                                    return CharDataMapping.getDataAll(charID,"loreCategories",null)
                                    .then((loreDataArray) => {
                                      return CharSpells.getFocusPoints(charID)
                                      .then((focusPointDataArray) => {
                                        return CharGathering.getFinalProfs(charID)
                                        .then((profMap) => {
                                          return CharGathering.getAllDomains(character)
                                          .then((domains) => {
                                            return CharGathering.getChoicesDomains(charID)
                                            .then((domainDataArray) => {
                                              return CharDataMapping.getDataAll(charID, "advancedDomains",Domain)
                                              .then((advancedDomainDataArray) => {
                                                return CharGathering.getAllExtraClassFeatures(charID)
                                                .then((extraClassFeatures) => {

                                                  let choiceStruct = {
                                                    Character: character,
                                                    Heritage: heritage,
                                                    Background: background,
                                                    Ancestry: ancestry,
                                                    ClassDetails: classDetails,
                                                    CharTagsArray: charTagsArray,
                                                    FeatArray: featDataArray,
                                                    BonusArray: bonusDataArray,
                                                    ChoiceArray: choiceDataArray,
                                                    ProfArray: profDataArray,
                                                    LangArray: langDataArray,
                                                    SenseArray: senseDataArray,
                                                    PhyFeatArray: phyFeatDataArray,
                                                    InnateSpellArray: innateSpellDataArray,
                                                    FinalProfObject: mapToObj(profMap),
                                                    AllDomains: domains,
                                                    AllAncestries: ancestries,
                                                    DomainArray: domainDataArray,
                                                    AdvancedDomainArray: advancedDomainDataArray,
                                                    FocusPointArray: focusPointDataArray,
                                                    LoreArray: loreDataArray,
                                                    ExtraClassFeaturesArray: extraClassFeatures,
                                                  };
        
                                                  return choiceStruct;
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
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

    static getBuilderCore(charID) {
        return CharGathering.getAllFeats(charID)
        .then( (featObject) => {
            return CharGathering.getAllItems(charID)
            .then( (itemMap) => {
                return CharGathering.getAllSpells(charID)
                .then((spellMap) => {
                    return CharGathering.getAllSkills(charID)
                    .then((skillObject) => {
                        return CharGathering.getAllTags(charID)
                        .then( (tags) => {
                            return CharGathering.getAbilityScores(charID)
                            .then((abilObject) => {
                                return Condition.findAll()
                                .then((allConditions) => {
                                    return CharGathering.getAllLanguagesBasic(charID)
                                    .then((allLanguages) => {
                                        return {
                                            FeatObject: featObject,
                                            SkillObject: skillObject,
                                            ItemObject: mapToObj(itemMap),
                                            SpellObject: mapToObj(spellMap),
                                            AbilObject: abilObject,
                                            AllTags: tags,
                                            AllConditions: allConditions,
                                            AllLanguages: allLanguages,
                                        };
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static getChoicesAbilityBonus(charID) {
        return CharDataMappingExt.getDataAllAbilityBonus(charID)
        .then((bonusDataArray) => {
            return bonusDataArray;
        });
    }

    static getChoicesFeats(charID) {
        return CharDataMapping.getDataAll(charID, 'chosenFeats', Feat)
        .then((featDataArray) => {
            return featDataArray;
        });
    }

    static getChoicesDomains(charID) {
        return CharDataMapping.getDataAll(charID, 'domains', Domain)
        .then((domainDataArray) => {
            return domainDataArray;
        });
    }


    static getAllLanguagesBasic(charID) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Language.findAll({
          where: {
              homebrewID: {
                [Op.or]: CharContentHomebrew.getHomebrewArray(character)
              },
          }
        }).then((languages) => {
          return languages;
        });
      });
    }


    static getAncestry(character) {
        return Ancestry.findOne({
          where: {
            id: character.ancestryID,
          } 
        }).then((ancestry) => {
            return ancestry;
        });
    }

    static getBackground(character) {
      return Background.findOne({
        where: {
          id: character.backgroundID,
        } 
      }).then((background) => {
          return background;
      });
    }

    static getHeritage(character) {
        if(character.heritageID != null){
            return Heritage.findOne({ where: { id: character.heritageID } })
            .then((heritage) => {
                return heritage;
            });
        } else if (character.uniHeritageID != null) {
            return UniHeritage.findOne({ where: { id: character.uniHeritageID } })
            .then((uniHeritage) => {
                return uniHeritage;
            });
        } else {
            return Promise.resolve();
        }
    }

    static getClassBasic(character) {
      return Class.findOne({
        where: {
          id: character.classID,
        } 
      }).then((cClass) => {
          return cClass;
      });
    }

    static getClass(charID, classID) {
        return Class.findOne({
            where: { id: classID },
            raw: true,
        }).then((cClass) => {
            let srcStruct = {
                sourceType: 'class',
                sourceLevel: 1,
                sourceCode: 'keyAbility',
                sourceCodeSNum: 'a',
            };
            return CharDataMappingExt.getDataSingleAbilityBonus(charID, srcStruct)
            .then((keyBoostData) => {
               let keyAbility = null;
               if(keyBoostData != null) { keyAbility = keyBoostData.Ability; }
               if(cClass != null){
                    return ClassAbility.findAll({
                        order: [['level', 'ASC'],['name', 'ASC'],],
                        where: {
                            [Op.or]: [
                                { classID: cClass.id },
                                { indivClassName: cClass.name }
                            ],
                        },
                        raw: true,
                    }).then((classAbilities) => {
                        return {Class : cClass, Abilities : classAbilities, KeyAbility : keyAbility};
                    });
                } else {
                    return {Class : null, Abilities: null, KeyAbility : null};
                } 
            });
        });
    }

    static getCharacter(charID) {
        return Character.findOne({ where: { id: charID } })
        .then((character) => {
            return character;
        });
    }

    static getAllAbilityTypes() {
        return ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
    }

    static getAncestryLanguages(ancestryID){
        return AncestryLanguage.findAll({ where: { ancestryID: ancestryID } })
        .then((ancestLangs) => {
            return ancestLangs;
        });
    }

    static getLanguageByName(charID, langName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Language.findOne({
          where: {
            name: langName,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character)
            },
          }
        }).then((language) => {
          return language;
        });
      });
    }

    static getFeatByName(charID, featName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Feat.findOne({
          where: {
            name: featName,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character)
            },
          }
        }).then((feat) => {
            return feat;
        });
      });
    }

    static getSpellByName(charID, spellName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Spell.findOne({
          where: {
            name: spellName,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character)
            },
          }
        }).then((spell) => {
            return spell;
        });
      });
    }

    static getSenseTypeByName(charID, senseTypeName) {
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

    static getPhyFeatByName(charID, phyFeatName) {
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

    static getClassFeatureByName(charID, featureName) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return ClassAbility.findOne({
          where: {
            name: featureName,
            contentSrc: {
              [Op.or]: CharContentSources.getSourceArray(character)
            },
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character)
            },
          }
        })
        .then((classFeature) => {
          return classFeature;
        });
      });
    }

    static getItem(charID, itemID) {
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return Item.findOne({
          where: {
            id: itemID,
            homebrewID: {
              [Op.or]: CharContentHomebrew.getHomebrewArray(character)
            },
          }
        }).then((item) => {
            return item;
        });
      });
    }

    static getAllAnimalCompanions(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return AnimalCompanion.findAll({
                where: {
                    contentSrc: {
                      [Op.or]: CharContentSources.getSourceArray(character)
                    },
                    homebrewID: {
                      [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                    },
                }
            })
            .then((animalCompanions) => {
                return animalCompanions;
            });
        });
    }

    static getAllSpecificFamiliars(charID) {
      return Character.findOne({ where: { id: charID} })
      .then((character) => {
          return SpecificFamiliar.findAll({
              where: {
                  contentSrc: {
                    [Op.or]: CharContentSources.getSourceArray(character)
                  },
                  homebrewID: {
                    [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                  },
              }
          })
          .then((specificFamiliars) => {
              return specificFamiliars;
          });
      });
    }

    static getAllFamiliarAbilities(charID) {
      return Character.findOne({ where: { id: charID} })
      .then((character) => {
          return FamiliarAbility.findAll({
              where: {
                  contentSrc: {
                    [Op.or]: CharContentSources.getSourceArray(character)
                  },
                  homebrewID: {
                    [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                  },
              }
          })
          .then((familiarAbilities) => {
              return familiarAbilities;
          });
      });
  }

    static getCompanionData(charID){
      return CharGathering.getAllAnimalCompanions(charID)
      .then((allAnimalCompanions) => {
        return CharAnimalCompanion.findAll({ where: { charID: charID} })
        .then((charAnimalComps) => {
          return CharGathering.getAllSpecificFamiliars(charID)
          .then((allSpecificFamiliars) => {
            return CharGathering.getAllFamiliarAbilities(charID)
            .then((allFamiliarAbilities) => {
              return CharFamiliar.findAll({ where: { charID: charID} })
              .then((charFamiliars) => {

                return {
                    AllAnimalCompanions : allAnimalCompanions,
                    AnimalCompanions : charAnimalComps,
                    AllSpecificFamiliars : allSpecificFamiliars,
                    AllFamiliarAbilities : allFamiliarAbilities,
                    Familiars : charFamiliars,
                };

              });
            });
          });
        });
      });
    }

    static getAbilityScores(charID) {

        return CharGathering.getBaseAbilityScores(charID)
        .then((charAbilityScores) => {
            return CharDataMappingExt.getDataAllAbilityBonus(charID)
            .then((bonusDataArray) => {

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

            });
        });

    }

    

    static getFinalProfs(charID) {

        console.log('~~~~~~~~~~~ REQUESTING FINAL PROFS ~~~~~~~~~~~');

        return CharDataMappingExt.getDataAllProficiencies(charID)
        .then((profDataArray) => {
            let newProfMap = new Map();
            for(const profData of profDataArray){

                let userAdded = false;
                if(profData.sourceType === 'user-added') {
                    userAdded = true;
                }

                if(profData.sourceType === 'user-set') { // Hardcoded User-Set Data

                    let userBonus = getUserBonus(profData.Prof);
                    let profOverride = (userBonus == 0);

                    let profMapValue = newProfMap.get(profData.To);
                    if(profMapValue != null){

                        let bestProf = getBetterProf(profMapValue.BestProf, profData.Prof);
                        let numIncreases = profMapValue.NumIncreases+getUpAmt(profData.Prof);
                        if(profMapValue.UserProfOverride){
                            bestProf = profMapValue.BestProf;
                            numIncreases = profMapValue.NumIncreases;
                        }
                        if(profOverride){
                            bestProf = getBetterProf('U', profData.Prof);
                            numIncreases = getUpAmt(profData.Prof);
                        }

                        let userBonus = getUserBonus(profData.Prof);
                        newProfMap.set(profData.To, {
                            BestProf : bestProf,
                            NumIncreases : numIncreases,
                            For : profMapValue.For,
                            UserBonus : ((profMapValue.UserBonus > userBonus) ? profMapValue.UserBonus : userBonus),
                            UserProfOverride : profOverride,
                            UserAdded : (userAdded || profMapValue.UserAdded),
                            OriginalData : profData,
                        });

                    } else {

                        newProfMap.set(profData.To, {
                            BestProf : getBetterProf('U', profData.Prof),
                            NumIncreases : getUpAmt(profData.Prof),
                            For : profData.For,
                            UserBonus : userBonus,
                            UserProfOverride : profOverride,
                            UserAdded : userAdded,
                            OriginalData : profData,
                        });

                    }

                } else {

                    let profMapValue = newProfMap.get(profData.To);
                    if(profMapValue != null){

                        let bestProf = getBetterProf(profMapValue.BestProf, profData.Prof);
                        let numIncreases = profMapValue.NumIncreases+getUpAmt(profData.Prof);
                        if(profMapValue.UserProfOverride){
                            bestProf = profMapValue.BestProf;
                            numIncreases = profMapValue.NumIncreases;
                        }

                        let userBonus = getUserBonus(profData.Prof);
                        newProfMap.set(profData.To, {
                            BestProf : bestProf,
                            NumIncreases : numIncreases,
                            For : profMapValue.For,
                            UserBonus : ((profMapValue.UserBonus > userBonus) ? profMapValue.UserBonus : userBonus),
                            UserProfOverride : false,
                            UserAdded : (userAdded || profMapValue.UserAdded),
                            OriginalData : profData,
                        });

                    } else {

                        newProfMap.set(profData.To, {
                            BestProf : getBetterProf('U', profData.Prof),
                            NumIncreases : getUpAmt(profData.Prof),
                            For : profData.For,
                            UserBonus : 0,
                            UserProfOverride : false,
                            UserAdded : userAdded,
                            OriginalData : profData,
                        });

                    }

                }

            }

            for(const [profName, profMapData] of newProfMap.entries()){
                
                newProfMap.set(profName, {
                    Name : profName,
                    NumUps : profTypeToNumber(profMapData.BestProf)+profMapData.NumIncreases,
                    For : profMapData.For,
                    UserBonus : profMapData.UserBonus,
                    UserProfOverride : profMapData.UserProfOverride,
                    UserAdded : profMapData.UserAdded,
                    OriginalData : profMapData.OriginalData,
                });
                        
            }

            return newProfMap;
        });
    }

    static getCharacterInfo(charID){
      console.log('~~~~~~~~~~~ REQUESTING CHAR INFO ~~~~~~~~~~~');

      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return CharGathering.getBackground(character)
        .then((background) => {
          return CharGathering.getAncestry(character)
          .then((ancestry) => {
            return CharGathering.getHeritage(character)
            .then((heritage) => {
              return Inventory.findOne({ where: { id: character.inventoryID} })
              .then((inventory) => {
                return CharGathering.getAllTags(charID)
                .then( (tags) => {
                  return CharGathering.getAbilityScores(charID)
                  .then((abilObject) => {
                    return CharGathering.getAllSkills(charID)
                    .then((skillObject) => {
                      return CharGathering.getCharChoices(charID)
                      .then( (choicesStruct) => {
                        return CharGathering.getSpellData(charID)
                        .then((spellDataStruct) => {
                          return CharGathering.getAllSpells(charID)
                          .then((spellMap) => {
                            return CharGathering.getAllFeats(charID)
                            .then( (featObject) => {
                              return CharGathering.getAllItems(charID)
                              .then( (itemMap) => {
                                return CharGathering.getAllCharConditions(charID)
                                .then( (conditionsObject) => {
                                  return Condition.findAll()
                                  .then((allConditions) => {
                                    return Language.findAll({
                                      where: {
                                          homebrewID: {
                                            [Op.or]: CharContentHomebrew.getHomebrewArray(character)
                                          },
                                      }
                                    }).then((allLanguages) => {
                                      return CharGathering.getInventory(character.inventoryID)
                                      .then( (invStruct) => {
                                        return CharGathering.getCompanionData(charID)
                                        .then( (companionData) => {
                                          return CharGathering.getResistancesAndVulnerabilities(charID)
                                          .then( (resistAndVulnerStruct) => {
                                            return CharGathering.getSpecializations(charID)
                                            .then( (specializeStruct) => {
                                              return CharGathering.getNoteFields(charID)
                                              .then( (notesDataArray) => {
                                                return CharGathering.getOtherSpeeds(charID)
                                                .then( (speedsDataArray) => {
                                                  return CharGathering.getWeaponFamiliarities(charID)
                                                  .then( (familiaritiesDataArray) => {
                                                    return CharGathering.getAllClassFeatureOptions(charID)
                                                    .then( (allClassFeatureOptions) => {
                                                                                                
                                                      let charInfo = {
                                                        Character : character,
                                                        Background : background,
                                                        Ancestry : ancestry,
                                                        Heritage : heritage,
                                                        Inventory : inventory,
                                                        AbilObject : abilObject,
                                                        SkillObject : skillObject,
                                                        FeatObject : featObject,
                                                        ProfObject : choicesStruct.FinalProfObject,
                                                        SpellObject : mapToObj(spellMap),
                                                        ChoicesStruct : choicesStruct,
                                                        SpellDataStruct: spellDataStruct,
                                                        InvStruct : invStruct,
                                                        ItemObject : mapToObj(itemMap),
                                                        ConditionsObject : conditionsObject,
                                                        AllConditions : allConditions,
                                                        AllLanguages : allLanguages,
                                                        ResistAndVulners : resistAndVulnerStruct,
                                                        SpecializeStruct : specializeStruct,
                                                        WeaponFamiliarities : familiaritiesDataArray,
                                                        NotesFields : notesDataArray,
                                                        OtherSpeeds : speedsDataArray,
                                                        AllTags : tags,
                                                        CompanionData : companionData,
                                                        AllClassFeatureOptions: allClassFeatureOptions,
                                                      };
                                                                      
                                                      return charInfo;
                                                    });
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
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

    static getCharacterInfoExportToPDF(charID){
      return Character.findOne({ where: { id: charID } })
      .then((character) => {
        return CharGathering.getCalculatedStats(charID).then((calculatedStats) => {
          return CharGathering.getAllMetadata(charID).then((metaDatas) => {
            return CharGathering.getAllCharConditions(charID).then((conditionsObject) => {
              return CharTags.getTags(charID).then((charTags) => {
                return CharGathering.getAncestry(character).then((ancestry) => {
                  return CharGathering.getBackground(character).then((background) => {
                    return CharGathering.getHeritage(character).then((heritage) => {
                      return CharGathering.getClassBasic(character).then((cClass) => {

                        return {
                          Ancestry: ancestry,
                          Background: background,
                          Heritage: heritage,
                          Class: cClass,
                          Character: character,
                          CalculatedStats: calculatedStats,
                          MetaDatas: metaDatas,
                          ConditionsObject: conditionsObject,
                          CharTags: charTags,
                        };

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

    static getBaseAbilityScores(charID) {

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
