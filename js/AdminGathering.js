
const Class = require('../models/contentDB/Class');
const ClassAbility = require('../models/contentDB/ClassAbility');
const Archetype = require('../models/contentDB/Archetype');
const Feat = require('../models/contentDB/Feat');
const FeatTag = require('../models/contentDB/FeatTag');
const Tag = require('../models/contentDB/Tag');
const Spell = require('../models/contentDB/Spell');
const TaggedSpell = require('../models/contentDB/TaggedSpell');
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

const CharGathering = require('./CharGathering');

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
}

module.exports = class AdminGathering {

    static getAllClasses() {
        return Class.findAll()
        .then((classes) => {
            return ClassAbility.findAll({
                order: [['level', 'ASC'],['name', 'ASC'],]
            })
            .then((allClassAbilities) => {
                
                let classMap = new Map();

                for (const cClass of classes) {
                    classMap.set(cClass.id, {Class : cClass, Abilities : []}); 
                }

                for (const classAbil of allClassAbilities) {
                    let classID = classAbil.classID;

                    let classStruct = classMap.get(classID);
                    classStruct.Abilities.push(classAbil);

                }

                return mapToObj(classMap);

            });
        });
    }

    static getAllArchetypes() {
        return Archetype.findAll()
        .then((archetypes) => {
            return archetypes;
        });
    }

    static getAllUniHeritages() {
        return UniHeritage.findAll()
        .then((uniHeritages) => {
            return uniHeritages;
        });
    }

    static getAllBackgrounds() {
        return Background.findAll()
        .then((backgrounds) => {
            return backgrounds;
        });
    }

    static getAllFeats() {
        return Feat.findAll()
        .then((feats) => {
            return FeatTag.findAll()
            .then((featTags) => {
                return Tag.findAll()
                .then((tags) => {
    
                    let featMap = new Map();

                    for (const feat of feats) {
                        let fTags = [];
                        /*
                            If a feat has a genTypeName then it's a single feat for a class or ancestry.
                            Search and give it the trait for that class or ancestry.
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
                        featStruct.Tags.push(tag);

                    }

                    return mapToObj(featMap);
    
                });
            });
        });
    }

    static getAllSpells() {
        return Spell.findAll({
            order: [['level', 'ASC'],['name', 'ASC'],]
        })
        .then((spells) => {
            return TaggedSpell.findAll()
            .then((taggedSpells) => {
                return Tag.findAll()
                .then((tags) => {
    
                    let spellMap = new Map();

                    for (const spell of spells) {
                        spellMap.set(spell.id, {Spell : spell, Tags : []});
                    }

                    for (const taggedSpell of taggedSpells) {

                        let tag = tags.find(tag => {
                            return tag.id === taggedSpell.tagID;
                        });

                        let spellStruct = spellMap.get(taggedSpell.spellID);
                        spellStruct.Tags.push(tag);

                    }

                    return spellMap;
    
                });
            });
        });
    }

    static getAllItems(){

        console.log('~~~~~~~~~~~ ADMIN - REQUESTING ALL ITEMS ~~~~~~~~~~~');

        return Item.findAll()
        .then((items) => {
            return Tag.findAll()
            .then((tags) => {
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
    }

    static getAllAncestries(includeTag) {

        console.log('~~~~~~~~~~~ ADMIN - REQUESTING ALL ANCESTRIES ~~~~~~~~~~~');

        return Ancestry.findAll()
        .then((ancestries) => {
            return Heritage.findAll({
                order: [['name', 'ASC'],]
            })
            .then((heritages) => {
                return Language.findAll()
                .then((languages) => {
                    return AncestryLanguage.findAll()
                    .then((ancestLangs) => {
                        return AncestryBoost.findAll()
                        .then((ancestBoosts) => {
                            return AncestryFlaw.findAll()
                            .then((ancestFlaws) => {
                                return Tag.findAll()
                                .then((tags) => {
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

                                                let ancestryStruct = ancestryMap.get(heritage.ancestryID);
                                                ancestryStruct.Heritages.push(heritage);

                                            }

                                            for (const ancestLang of ancestLangs) {

                                                if(ancestLang.isBonus === 1) {

                                                    let language = languages.find(language => {
                                                        return language.id === ancestLang.langID;
                                                    });
                            
                                                    let ancestryStruct = ancestryMap.get(ancestLang.ancestryID);
                                                    ancestryStruct.BonusLanguages.push(language);

                                                } else {

                                                    let language = languages.find(language => {
                                                        return language.id === ancestLang.langID;
                                                    });
                            
                                                    let ancestryStruct = ancestryMap.get(ancestLang.ancestryID);
                                                    ancestryStruct.Languages.push(language);

                                                }

                                            }

                                            for (const ancestBoost of ancestBoosts) {

                                                let ancestryStruct = ancestryMap.get(ancestBoost.ancestryID);
                                                ancestryStruct.Boosts.push(ancestBoost.boostedAbility);

                                            }

                                            for (const ancestFlaw of ancestFlaws) {

                                                let ancestryStruct = ancestryMap.get(ancestFlaw.ancestryID);
                                                ancestryStruct.Flaws.push(ancestFlaw.flawedAbility);

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


};
